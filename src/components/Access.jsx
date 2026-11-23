import React from 'react'

/** Who gets Nandi, what the limited release contains, and how people are chosen. */

const INCLUDED = [
  ['Full source code', 'The brain and every server behind it: vision, voice and the VPS stack.'],
  ['Device automation', 'The Ubuntu and Android automation, with their apps.'],
  ['Setup guide', 'Step by step, from an empty server to a working Nandi.'],
  ['Capability demo', 'A walk-through of everything Nandi can do today.'],
]

const STEPS = [
  ['Join the waitlist', 'Tell us who you are and what you want to do with Nandi.'],
  ['We read every request', 'We look at your details and your intention.'],
  ['A few are invited', 'Each release goes to a small group of people.'],
]

export default function Access() {
  return (
    <div className="access">
      <div className="access__included">
        <h3>What the release includes</h3>
        <ul>
          {INCLUDED.map(([title, text]) => (
            <li key={title}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m5 12 4.5 4.5L19 7" /></svg>
              <div><strong>{title}</strong><span>{text}</span></div>
            </li>
          ))}
        </ul>
      </div>
      <ol className="access__steps">
        {STEPS.map(([title, text], i) => (
          <li key={title}>
            <span className="access__n">{i + 1}</span>
            <div><strong>{title}</strong><span>{text}</span></div>
          </li>
        ))}
      </ol>
    </div>
  )
}
