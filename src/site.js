// ─────────────────────────────────────────────────────────────────────────────
//  site.js — every company detail on the page, in one place. Edit only this file.
//
//  An empty value ('') is simply not shown, so nothing half-filled ever reaches
//  the live page. While you run `npm run dev`, a small box in the corner lists
//  what is still empty.
// ─────────────────────────────────────────────────────────────────────────────

export const site = {
  // The company shown in "Developed and powered by …" and in the footer.
  companyName: 'Shunn Labs Private Limited',
  companyShortName: 'Shunn Labs',
  // Replace public/shunnlabs-logo.svg with your logo (SVG or PNG; keep the name, or change it here).
  companyLogo: '/shunnlabs-logo.svg',
  companyWebsite: '',                 // e.g. 'https://shunnlabs.com'

  // Registered office, one line per entry.
  address: [
    // 'Line 1',
    // 'City, State PIN',
    // 'India',
  ],

  // Contact.
  email: 'support@sunlabs.com',
  whatsapp: '',                       // with country code, digits only, e.g. '919876543210'

  // Follow us (full URLs).
  linkedin: '',                       // e.g. 'https://www.linkedin.com/company/…'
  instagram: '',                      // e.g. 'https://www.instagram.com/…'
  youtube: '',                        // e.g. 'https://www.youtube.com/@…'

  // A demo video; the "Watch the demo" button appears once this is set.
  demoVideo: '',                      // e.g. 'https://www.youtube.com/watch?v=…'
}

// Where waitlist sign-ups are sent: the Google Apps Script web-app URL (README.md, "Waitlist").
// Set VITE_WAITLIST_URL in Vercel, not here, so changing it needs no commit.
export const WAITLIST_URL = (import.meta.env.VITE_WAITLIST_URL || '').trim()

/** What is still empty (shown only while developing). */
export function missingDetails() {
  const missing = []
  if (!site.address.filter(Boolean).length) missing.push('address')
  for (const key of ['whatsapp', 'linkedin', 'instagram', 'youtube', 'demoVideo', 'companyWebsite']) {
    if (!String(site[key] || '').trim()) missing.push(key)
  }
  if (!WAITLIST_URL) missing.push('VITE_WAITLIST_URL')
  return missing
}
