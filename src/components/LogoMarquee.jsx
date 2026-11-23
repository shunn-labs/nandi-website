import React from 'react'
import {
  siAndroid, siCaddy, siClaude, siDocker, siElevenlabs, siFastapi, siGstreamer, siHomeassistant,
  siHuggingface, siLanggraph, siModelcontextprotocol, siNvidia, siPipecat, siPostgresql, siPython,
  siPytorch, siQwen, siReact, siRedis, siTailscale, siUbuntu, siWebrtc, siWhatsapp,
} from 'simple-icons'

/**
 * "Built with": two rows of the technologies inside Nandi, drifting slowly in opposite
 * directions. Brand marks are Simple Icons (CC0 data; each mark belongs to its owner), shown
 * grey and taking their colour on hover. Models and tools without a public mark are chips.
 * The rows pause on hover, and stand still for "reduce motion" (see styles.css).
 */

const icon = (si, label) => ({ label: label || si.title, path: si.path, hex: si.hex })
const chip = (label) => ({ label })

const ROWS = [
  // the mind: models, reasoning, voice and vision
  [
    icon(siClaude, 'Claude'), icon(siModelcontextprotocol, 'MCP'), icon(siLanggraph), chip('Grounding DINO'),
    chip('SAM 2'), chip('Whisper'), icon(siQwen, 'Qwen3-TTS'), chip('Silero VAD'), icon(siPytorch),
    icon(siHuggingface), icon(siNvidia, 'NVIDIA CUDA'), icon(siElevenlabs), icon(siPipecat), chip('OpenAI'),
  ],
  // the body: servers, storage, devices and channels
  [
    icon(siPython), icon(siFastapi), icon(siPostgresql), chip('pgvector'), icon(siRedis), chip('SeaweedFS'),
    icon(siDocker), icon(siWebrtc), icon(siGstreamer), icon(siUbuntu), icon(siAndroid), icon(siWhatsapp),
    icon(siHomeassistant), icon(siTailscale), icon(siCaddy), icon(siReact),
  ],
]

function Item({ item, dup }) {
  const extra = dup ? ' tech--dup' : ''
  if (!item.path) return <span className={`tech tech--chip${extra}`} aria-hidden={dup || undefined}>{item.label}</span>
  // Very dark brand colours would vanish into the grey; they keep the ink colour on hover.
  const dark = parseInt(item.hex.slice(0, 2), 16) + parseInt(item.hex.slice(2, 4), 16)
    + parseInt(item.hex.slice(4, 6), 16) < 150
  return (
    <span className={`tech${extra}`} aria-hidden={dup || undefined} style={dark ? undefined : { '--brand': `#${item.hex}` }}>
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d={item.path} /></svg>
      <span>{item.label}</span>
    </span>
  )
}

export default function LogoMarquee() {
  return (
    <div className="marquee">
      {ROWS.map((row, r) => (
        <div key={r} className={`marquee__row ${r % 2 ? 'marquee__row--reverse' : ''}`} aria-hidden="true">
          {/* The track holds the row twice, so the loop has no seam. */}
          <div className="marquee__track">
            {[...row, ...row].map((item, i) => (
              <Item key={`${item.label}-${i}`} item={item} dup={i >= row.length} />
            ))}
          </div>
        </div>
      ))}
      <ul className="visually-hidden" aria-label="Technologies Nandi is built with">
        {ROWS.flat().map((item) => <li key={item.label}>{item.label}</li>)}
      </ul>
    </div>
  )
}
