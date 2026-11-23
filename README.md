# Nandi website

The product page for **Nandi, an AI for the environment**, developed and powered by Shunn Labs Private
Limited. It has one page: the globe, the mission, what Nandi does, the technologies it is built with, the
limited release, and the waitlist. It lives at **https://nandi.shunnlabs.com**.

Vite + React 18, plain CSS, no UI library. Brand marks come from [Simple Icons](https://simpleicons.org)
(CC0 icon data; each mark belongs to its owner).

```bash
npm ci
npm run dev        # http://localhost:5173 (a corner box lists details still empty in src/site.js)
npm run build      # → dist/
npm run preview    # serve dist/ locally
```

## Edit the company details
Everything about the company is in **`src/site.js`**:
- name, address, WhatsApp number, email;
- LinkedIn, Instagram and YouTube links;
- the demo video and the company website.

A value left empty is simply not shown on the page. Replace **`public/shunnlabs-logo.svg`** with the Shunn
Labs logo, keeping the name, or point `companyLogo` at another file.

| Change | File |
|---|---|
| Texts on the page | `src/App.jsx`, `src/components/Capabilities.jsx`, `src/components/Access.jsx` |
| Logos in "Built with" | `src/components/LogoMarquee.jsx` (`ROWS`) |
| Waitlist questions | `src/components/WaitlistForm.jsx`, plus the columns in `waitlist/apps-script.gs` |
| Colours and fonts | the tokens at the top of `src/styles.css` |
| The globe | `src/components/Globe.jsx` (ported from the Nandi web app's `Core.jsx`) |

## Waitlist (Google Sheet)
The form sends each sign-up as JSON to a Google Apps Script web app, which adds a row to a Google Sheet.
There is no server to run.

1. Create a Google Sheet, then open **Extensions → Apps Script**.
2. Paste in `waitlist/apps-script.gs` and save.
3. **Deploy → New deployment → Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Deploy, allow the permissions, and copy the URL (it ends in `/exec`).
5. In Vercel, add the environment variable **`VITE_WAITLIST_URL`** = that URL, then redeploy.
   - For a local test, put the URL in `.env.local` instead.

Rows land in the **Waitlist** tab:
- A repeat email is still saved, marked "repeat".
- Bots that fill the hidden honeypot field are dropped.
- Cells that would start a formula are stored as text.

Until `VITE_WAITLIST_URL` is set, the form opens the visitor's email app with the answers, addressed to the
support email. After changing the script, use **Manage deployments → Edit → New version**, so the URL stays
the same.

## Hosting (Vercel + Cloudflare)
1. **Vercel**:
   - **Add New → Project → import `shunn-labs/nandi-website`**; the Vite preset is detected.
   - Add `VITE_WAITLIST_URL`, then **Deploy**.
   - **Settings → Domains → add `nandi.shunnlabs.com`**.
2. **Cloudflare**, zone `shunnlabs.com`: add `CNAME`, name `nandi`, target `cname.vercel-dns.com`, proxy
   **DNS only**.

Every push to `main` redeploys.
