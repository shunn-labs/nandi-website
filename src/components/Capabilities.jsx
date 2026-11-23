import React from 'react'

/** Six things Nandi does today, one line each. Plain words, nothing promised that isn't built. */

const ITEMS = [
  {
    title: 'Talks and listens',
    text: 'Real-time voice conversations in Hindi and English, on any screen or speaker.',
    icon: 'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Zm7 9a7 7 0 0 1-14 0M12 19v2',
  },
  {
    title: 'Sees',
    text: 'Watches live cameras, finds and outlines objects, and recognises the people it knows.',
    icon: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  },
  {
    title: 'Uses your devices',
    text: 'Drives an Ubuntu PC and Android phones the way a person would, screen recording included.',
    icon: 'M3 5h13v9H3zM7 18h5M9.5 14v4M18 8h3v11h-3z',
  },
  {
    title: 'Plans before it acts',
    text: 'For bigger jobs it shows a short plan, waits for your OK, and tries another way when a step fails.',
    icon: 'M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2',
  },
  {
    title: 'Moves files anywhere',
    text: 'Every recording, photo and document it handles can go out on WhatsApp, by email, or to a device.',
    icon: 'M4 12 20 4l-4 16-4-7-8-1Zm8 1 8-9',
  },
  {
    title: 'Runs the home',
    text: 'Lights, switches and sensors through Home Assistant, by voice or on a schedule.',
    icon: 'M3 11 12 4l9 7M5 10v10h14V10M10 20v-5h4v5',
  },
]

export default function Capabilities() {
  return (
    <div className="caps">
      {ITEMS.map((item) => (
        <article key={item.title} className="cap">
          <svg className="cap__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d={item.icon} />
          </svg>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
        </article>
      ))}
    </div>
  )
}
