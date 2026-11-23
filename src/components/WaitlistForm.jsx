import React, { useState } from 'react'
import { WAITLIST_URL, site } from '../site.js'

/**
 * The waitlist. Answers go as JSON to a Google Apps Script web app (waitlist/apps-script.gs),
 * which adds a row to a Google Sheet. The body is sent as text/plain so the browser makes no
 * CORS preflight, which Apps Script cannot answer.
 *
 * `website` is a honeypot: hidden from people, filled in by bots. A request with it set is
 * dropped here (and again in the script) but looks successful to the bot.
 */

const ROLES = ['Individual', 'Student', 'Developer', 'Company', 'Researcher', 'NGO']
const USES = ['An environment project', 'Devices and home automation', 'Learning and research', 'Business', 'Other']
const INTERESTS = ['Source code', 'Setup guide', 'Capability demo']
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const EMPTY = {
  name: '', email: '', whatsapp: '', location: '', role: '', organisation: '', use: '',
  interests: [], intention: '', consent: false, website: '',
}

function check(v) {
  const e = {}
  if (v.name.trim().length < 2) e.name = 'Please tell us your name.'
  if (!EMAIL_RE.test(v.email.trim())) e.email = 'Please enter a valid email address.'
  if (v.whatsapp && !/^\+?[\d\s-]{8,18}$/.test(v.whatsapp.trim())) e.whatsapp = 'Digits only, with the country code.'
  if (v.location.trim().length < 2) e.location = 'Where are you based?'
  if (!v.role) e.role = 'Pick the closest one.'
  if (!v.use) e.use = 'Pick the closest one.'
  if (v.intention.trim().length < 20) e.intention = 'A sentence or two, please (at least 20 characters).'
  if (!v.consent) e.consent = 'We need your OK to contact you.'
  return e
}

async function send(payload) {
  const body = JSON.stringify(payload)
  const opts = { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body, redirect: 'follow' }
  try {
    const res = await fetch(WAITLIST_URL, opts)
    const data = await res.json().catch(() => ({}))
    if (!res.ok || data.ok === false) throw new Error(data.error || `HTTP ${res.status}`)
    return true
  } catch (err) {
    // Some browsers block reading the answer after Apps Script's redirect. The row is still
    // written, so send once more without reading the answer and trust it.
    if (err instanceof TypeError) {
      await fetch(WAITLIST_URL, { ...opts, mode: 'no-cors' })
      return true
    }
    throw err
  }
}

export default function WaitlistForm() {
  const [v, setV] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [state, setState] = useState('idle')        // idle | sending | done | failed
  const [failure, setFailure] = useState('')

  const set = (name) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setV((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }
  const toggleInterest = (item) => setV((prev) => ({
    ...prev,
    interests: prev.interests.includes(item) ? prev.interests.filter((x) => x !== item) : [...prev.interests, item],
  }))

  const submit = async (e) => {
    e.preventDefault()
    const found = check(v)
    setErrors(found)
    if (Object.keys(found).length) {
      document.getElementById(`wl-${Object.keys(found)[0]}`)?.focus()
      return
    }
    if (v.website) { setState('done'); return }      // a bot filled the honeypot
    const payload = {
      name: v.name.trim(), email: v.email.trim().toLowerCase(), whatsapp: v.whatsapp.trim(),
      location: v.location.trim(), role: v.role, organisation: v.organisation.trim(), use: v.use,
      interests: v.interests, intention: v.intention.trim(), consent: true, website: '',
      page: window.location.href, submittedAt: new Date().toISOString(),
    }
    if (!WAITLIST_URL) {
      // Not connected yet: hand the answers to the visitor's email app instead.
      const text = Object.entries(payload).filter(([k]) => !['website', 'page', 'consent'].includes(k))
        .map(([k, val]) => `${k}: ${Array.isArray(val) ? val.join(', ') : val}`).join('\n')
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent('Nandi waitlist')}&body=${encodeURIComponent(text)}`
      setState('done')
      return
    }
    setState('sending')
    try {
      await send(payload)
      setState('done')
    } catch (err) {
      setFailure(err.message || 'Something went wrong.')
      setState('failed')
    }
  }

  if (state === 'done') {
    return (
      <div className="wl-done" role="status">
        <div className="wl-done__mark" aria-hidden="true">✓</div>
        <h3>You're on the list.</h3>
        <p>We read every request ourselves. If Nandi is a fit for what you want to do, we will write to you at {v.email || 'your email'}.</p>
      </div>
    )
  }

  const field = (name, label, input, hint) => (
    <div className={`wl-field ${errors[name] ? 'wl-field--error' : ''}`}>
      <label htmlFor={`wl-${name}`}>{label}</label>
      {input}
      {errors[name] ? <span className="wl-error" id={`wl-${name}-err`}>{errors[name]}</span> : hint && <span className="wl-hint">{hint}</span>}
    </div>
  )
  const aria = (name) => ({ id: `wl-${name}`, 'aria-invalid': Boolean(errors[name]), 'aria-describedby': errors[name] ? `wl-${name}-err` : undefined })

  return (
    <form className="wl" onSubmit={submit} noValidate>
      <div className="wl-grid">
        {field('name', 'Name', <input {...aria('name')} value={v.name} onChange={set('name')} autoComplete="name" maxLength={80} />)}
        {field('email', 'Email', <input {...aria('email')} type="email" value={v.email} onChange={set('email')} autoComplete="email" maxLength={120} />)}
        {field('whatsapp', 'WhatsApp number', <input {...aria('whatsapp')} type="tel" value={v.whatsapp} onChange={set('whatsapp')} autoComplete="tel" placeholder="+91 …" maxLength={20} />, 'Optional')}
        {field('location', 'City and country', <input {...aria('location')} value={v.location} onChange={set('location')} autoComplete="address-level2" maxLength={80} />)}
        {field('role', 'You are', (
          <select {...aria('role')} value={v.role} onChange={set('role')}>
            <option value="">Choose…</option>
            {ROLES.map((r) => <option key={r}>{r}</option>)}
          </select>
        ))}
        {field('organisation', 'Organisation', <input {...aria('organisation')} value={v.organisation} onChange={set('organisation')} autoComplete="organization" maxLength={100} />, 'Optional')}
        {field('use', 'You would use Nandi for', (
          <select {...aria('use')} value={v.use} onChange={set('use')}>
            <option value="">Choose…</option>
            {USES.map((u) => <option key={u}>{u}</option>)}
          </select>
        ))}
        <fieldset className="wl-field wl-interests">
          <legend>You are interested in</legend>
          <div className="wl-chips">
            {INTERESTS.map((item) => (
              <label key={item} className={`wl-chip ${v.interests.includes(item) ? 'wl-chip--on' : ''}`}>
                <input type="checkbox" checked={v.interests.includes(item)} onChange={() => toggleInterest(item)} />
                {item}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      {field('intention', 'What do you want to do with Nandi?', (
        <textarea {...aria('intention')} value={v.intention} onChange={set('intention')} rows={4} maxLength={1200}
          placeholder="Your project, your devices, what you hope Nandi will do." />
      ))}

      {/* Honeypot: off-screen and skipped by keyboard and screen readers. */}
      <div className="wl-hp" aria-hidden="true">
        <label htmlFor="wl-website">Website</label>
        <input id="wl-website" tabIndex={-1} autoComplete="off" value={v.website} onChange={set('website')} />
      </div>

      <div className={`wl-consent ${errors.consent ? 'wl-field--error' : ''}`}>
        <label>
          <input id="wl-consent" type="checkbox" checked={v.consent} onChange={set('consent')} />
          <span>{site.companyShortName} may contact me about Nandi. My details are used only to review this request.</span>
        </label>
        {errors.consent && <span className="wl-error">{errors.consent}</span>}
      </div>

      <div className="wl-actions">
        <button className="btn btn--primary" type="submit" disabled={state === 'sending'}>
          {state === 'sending' ? 'Sending…' : 'Join the waitlist'}
        </button>
        {state === 'failed' && (
          <span className="wl-error" role="alert">
            That didn't go through ({failure}). Try again, or write to <a href={`mailto:${site.email}`}>{site.email}</a>.
          </span>
        )}
      </div>
    </form>
  )
}
