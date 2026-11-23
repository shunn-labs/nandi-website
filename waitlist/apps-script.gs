/**
 * Nandi waitlist → Google Sheet.
 *
 * Setup (once):
 *   1. Create a Google Sheet (any name). Extensions → Apps Script. Replace the code with this file. Save.
 *   2. Deploy → New deployment → type "Web app".
 *        Execute as:      Me
 *        Who has access:  Anyone
 *      Deploy, allow the permissions, and copy the Web app URL (it ends in /exec).
 *   3. Put that URL in Vercel as VITE_WAITLIST_URL (Project → Settings → Environment Variables), then redeploy.
 *
 * Each sign-up becomes one row in the "Waitlist" tab (created on the first sign-up). A repeat email is
 * still saved, marked "repeat", so you can see someone asked twice. After editing this code, use
 * Deploy → Manage deployments → Edit → Version: New version, so the same URL serves the new code.
 */

const SHEET_NAME = 'Waitlist';
const COLUMNS = [
  'Received', 'Name', 'Email', 'WhatsApp', 'City and country', 'Role', 'Organisation',
  'Use', 'Interested in', 'Intention', 'Repeat', 'Page',
];
const MAX = { name: 80, email: 120, whatsapp: 20, location: 80, role: 40, organisation: 100, use: 60, intention: 1200, page: 300 };

function doPost(e) {
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    // Honeypot: people never see this field; bots fill it. Pretend success, store nothing.
    if (data.website) return reply({ ok: true });

    const clean = {};
    Object.keys(MAX).forEach(function (k) { clean[k] = text(data[k], MAX[k]); });
    clean.email = clean.email.toLowerCase();
    const interests = Array.isArray(data.interests) ? data.interests.map(function (x) { return text(x, 40); }).join(', ') : '';

    if (clean.name.length < 2) return reply({ ok: false, error: 'name is missing' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean.email)) return reply({ ok: false, error: 'email is not valid' });
    if (clean.intention.length < 20) return reply({ ok: false, error: 'intention is too short' });
    if (data.consent !== true) return reply({ ok: false, error: 'consent is missing' });

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const sheet = waitlistSheet();
      const emails = sheet.getLastRow() > 1 ? sheet.getRange(2, 3, sheet.getLastRow() - 1, 1).getValues().flat() : [];
      const repeat = emails.indexOf(clean.email) >= 0 ? 'repeat' : '';
      sheet.appendRow([
        new Date(), safe(clean.name), clean.email, safe(clean.whatsapp), safe(clean.location), safe(clean.role),
        safe(clean.organisation), safe(clean.use), safe(interests), safe(clean.intention), repeat, safe(clean.page),
      ]);
    } finally {
      lock.releaseLock();
    }
    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: 'could not save: ' + err });
  }
}

// Opening the URL in a browser shows that the script is live.
function doGet() {
  return reply({ ok: true, service: 'nandi-waitlist' });
}

function waitlistSheet() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = book.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = book.insertSheet(SHEET_NAME);
    sheet.appendRow(COLUMNS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold');
  }
  return sheet;
}

function text(value, max) {
  return String(value == null ? '' : value).replace(/[\u0000-\u001f]+/g, ' ').trim().slice(0, max);
}

// A cell starting with = + - @ would run as a formula in Sheets; prefix it so it stays text.
function safe(value) {
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
