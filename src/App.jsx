import React from 'react'
import Globe from './components/Globe.jsx'
import LogoMarquee from './components/LogoMarquee.jsx'
import Capabilities from './components/Capabilities.jsx'
import Access from './components/Access.jsx'
import WaitlistForm from './components/WaitlistForm.jsx'
import Footer from './components/Footer.jsx'
import { missingDetails, site } from './site.js'

function DevChecklist() {
  if (!import.meta.env.DEV) return null
  const missing = missingDetails()
  if (!missing.length) return null
  return (
    <aside className="dev-note">
      <strong>Still empty in src/site.js</strong> (only you see this, in dev): {missing.join(', ')}
    </aside>
  )
}

export default function App() {
  return (
    <>
      <header className="nav">
        <a className="brand" href="#top" aria-label="Nandi home">
          <img src="/nandi-mark.png" alt="" width="28" height="28" />
          <span>Nandi</span>
        </a>
        <nav className="nav__links" aria-label="Sections">
          <a href="#mission">Mission</a>
          <a href="#capabilities">Capabilities</a>
          <a href="#access">Access</a>
        </nav>
        <a className="btn btn--small" href="#waitlist">Join the waitlist</a>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero__text">
            <p className="eyebrow">By {site.companyShortName}</p>
            <h1>Nandi</h1>
            <p className="hero__tagline">An AI for the environment.</p>
            <p className="hero__lede">
              Built to care for the planet through robotics, software and satellites.
              Today it is learning on every device we own.
            </p>
            <div className="hero__actions">
              <a className="btn btn--primary" href="#waitlist">Join the waitlist</a>
              {site.demoVideo && (
                <a className="btn btn--ghost" href={site.demoVideo} target="_blank" rel="noopener noreferrer">
                  ▶ Watch the demo
                </a>
              )}
            </div>
          </div>
          <div className="hero__globe">
            <Globe />
          </div>
        </section>

        <section className="section section--mission" id="mission">
          <p className="eyebrow">Why Nandi</p>
          <h2>A mind for machines that look after the Earth.</h2>
          <p className="section__lede">
            Nandi is being built to coordinate robots, software and satellite data for work that protects the
            environment. To get there, it is first learning to see, listen, speak and act through every device
            in reach: computers, phones, cameras, microphones and the home.
          </p>
        </section>

        <section className="section" id="capabilities">
          <p className="eyebrow">What it can do today</p>
          <h2>One assistant, every device.</h2>
          <Capabilities />
        </section>

        <section className="section section--tech" aria-labelledby="tech-title">
          <p className="eyebrow" id="tech-title">Built with</p>
          <LogoMarquee />
        </section>

        <section className="section" id="access">
          <p className="eyebrow">Access</p>
          <h2>Not for everyone. Yet.</h2>
          <p className="section__lede">
            Nandi is not sold openly. It is released in small groups, to people whose work it can truly help.
          </p>
          <Access />
        </section>

        <section className="section section--waitlist" id="waitlist">
          <p className="eyebrow">Waitlist</p>
          <h2>Ask for early access.</h2>
          <p className="section__lede">A few questions, two minutes. We read every answer.</p>
          <WaitlistForm />
        </section>
      </main>

      <Footer />
      <DevChecklist />
    </>
  )
}
