import { useState } from 'react'
import { Home, Power } from 'lucide-react'

interface Props {
  haUrl?: string
  haToken?: string
}

export function HomeAssistantPanel({ haUrl, haToken }: Props) {
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const callService = async (domain: string, service: string, entityId?: string) => {
    if (!haUrl || !haToken) {
      setStatus('Configure Home Assistant URL + token in Settings.')
      return
    }
    setLoading(true)
    setStatus(null)
    try {
      const res = await fetch(`${haUrl.replace(/\/$/, '')}/api/services/${domain}/${service}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${haToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entityId ? { entity_id: entityId } : {}),
      })
      if (!res.ok) throw new Error(`HA error ${res.status}`)
      setStatus(`OK \u2013 called ${domain}.${service}`)
    } catch (e: any) {
      setStatus(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>
        {haUrl ? `Connected to ${haUrl}` : 'Not configured'}
      </div>
      <button className="quick-btn" disabled={loading} onClick={() => callService('light', 'toggle', 'all')} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Power size={14} /> Toggle all lights
      </button>
      <button className="quick-btn" disabled={loading} onClick={() => callService('homeassistant', 'turn_on')} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Home size={14} /> HA turn_on (demo)
      </button>
      {status && <div style={{ fontSize: 12, color: status.startsWith('OK') ? 'var(--success)' : 'var(--danger)' }}>{status}</div>}
    </div>
  )
}
