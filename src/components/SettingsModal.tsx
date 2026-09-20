import { useState, useEffect } from 'react'
import { X, Save } from 'lucide-react'
import type { AppSettings, VoiceBackend } from '../lib/types'

interface Props {
  open: boolean
  onClose: () => void
  onSave: (s: AppSettings) => void
}

const defaults: AppSettings = {
  openaiKey: '', elevenLabsKey: '', ollamaBase: 'http://127.0.0.1:11434',
  ollamaModel: 'llama3.2', voiceBackend: 'browser', haUrl: '', haToken: '',
}

export function SettingsModal({ open, onClose, onSave }: Props) {
  const [s, setS] = useState<AppSettings>(defaults)

  useEffect(() => {
    if (!open) return
    const stored = localStorage.getItem('jarvis-settings')
    if (stored) setS({ ...defaults, ...JSON.parse(stored) })
  }, [open])

  if (!open) return null

  const update = (partial: Partial<AppSettings>) => setS((prev) => ({ ...prev, ...partial }))

  const handleSave = () => {
    localStorage.setItem('jarvis-settings', JSON.stringify(s))
    onSave(s)
    onClose()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div className="panel" style={{ width: 420, maxWidth: '95vw' }} onClick={(e) => e.stopPropagation()}>
        <div className="panel-header" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span className="dot" /> Settings</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}><X size={18} /></button>
        </div>
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.1em' }}>VOICE BACKEND</label>
          <select value={s.voiceBackend} onChange={(e) => update({ voiceBackend: e.target.value as VoiceBackend })}
            style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid var(--border)', borderRadius: 8, padding: 10, color: 'var(--text)' }}>
            <option value="browser">Browser (free)</option>
            <option value="openai">OpenAI Realtime</option>
            <option value="elevenlabs">ElevenLabs</option>
            <option value="ollama">Ollama (local)</option>
          </select>
          <label style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.1em' }}>OPENAI API KEY</label>
          <input type="password" placeholder="sk-..." value={s.openaiKey} onChange={(e) => update({ openaiKey: e.target.value })}
            style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid var(--border)', borderRadius: 8, padding: 10, color: 'var(--text)' }} />
          <label style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.1em' }}>HOME ASSISTANT URL</label>
          <input placeholder="http://homeassistant.local:8123" value={s.haUrl} onChange={(e) => update({ haUrl: e.target.value })}
            style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid var(--border)', borderRadius: 8, padding: 10, color: 'var(--text)' }} />
          <label style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.1em' }}>HA TOKEN</label>
          <input type="password" value={s.haToken} onChange={(e) => update({ haToken: e.target.value })}
            style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid var(--border)', borderRadius: 8, padding: 10, color: 'var(--text)' }} />
        </div>
        <div style={{ padding: 16, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={handleSave} style={{
            display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,212,255,0.15)',
            border: '1px solid var(--accent)', color: 'var(--accent)', borderRadius: 8, padding: '10px 18px', cursor: 'pointer',
          }}>
            <Save size={16} /> Save
          </button>
        </div>
      </div>
    </div>
  )
}
