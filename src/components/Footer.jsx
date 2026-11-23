import React from 'react'
import { siInstagram, siWhatsapp, siYoutube } from 'simple-icons'
import { site } from '../site.js'

/** Who stands behind Nandi, how to reach us, where to follow. Empty details are left out. */

// LinkedIn is no longer in Simple Icons; this is its "in" mark, drawn plainly.
const LINKEDIN = 'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z'

const has = (v) => Boolean(String(v || '').trim())

function Social({ href, label, path }) {
  if (!has(href)) return null
  return (
    <a className="social" href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}>
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d={path} /></svg>
    </a>
  )
}

export default function Footer() {
  const address = site.address.filter(has)
  const wa = String(site.whatsapp || '').replace(/[^\d]/g, '')
  const socials = [site.linkedin, site.instagram, site.youtube].some(has)
  const year = new Date().getFullYear()

  return (
    <footer className="footer" id="contact">
      <div className="footer__grid">
        <div className="footer__company">
          <p className="footer__eyebrow">Developed and powered by</p>
          <a className="footer__logo" href={has(site.companyWebsite) ? site.companyWebsite : undefined}
             target="_blank" rel="noopener noreferrer">
            <img src={site.companyLogo} alt={site.companyName} />
          </a>
          <p className="footer__name">{site.companyName}</p>
          {address.length > 0 && (
            <address>{address.map((line) => <span key={line}>{line}</span>)}</address>
          )}
        </div>

        <div className="footer__col">
          <h4>Contact us</h4>
          {wa && (
            <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="footer__link">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d={siWhatsapp.path} /></svg>
              WhatsApp +{wa}
            </a>
          )}
          {has(site.email) && (
            <a href={`mailto:${site.email}`} className="footer__link">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18v12H3zM3 7l9 6 9-6" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>
              {site.email}
            </a>
          )}
        </div>

        {socials && (
          <div className="footer__col">
            <h4>Follow</h4>
            <div className="footer__socials">
              <Social href={site.linkedin} label="LinkedIn" path={LINKEDIN} />
              <Social href={site.instagram} label="Instagram" path={siInstagram.path} />
              <Social href={site.youtube} label="YouTube" path={siYoutube.path} />
            </div>
          </div>
        )}
      </div>

      <div className="footer__bottom">
        <span>© {year} {site.companyName}. All rights reserved.</span>
        <span>Waitlist details are used only to review requests for Nandi and are never sold.</span>
      </div>
    </footer>
  )
}
