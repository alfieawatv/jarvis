import { useEffect, useState } from 'react'
import { Activity, Cpu, Wifi } from 'lucide-react'
import type { SystemInfo } from '../lib/types'

interface Props {
  systemInfo: SystemInfo | null
  isListening: boolean
}

export function StatusBar({ systemInfo, isListening }: Props) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      className="status-bar panel"
      style={{
        gridColumn: '1 / -1',
        gridRow: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        zIndex: 20,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ fontFamily: 'var(--font-hud)', fontSize: 13, letterSpacing: '0.2em', color: 'var(--accent)' }}>
          J.A.R.V.I.S
        </div>
        <div style={{ width: 1, height: 18, background: 'var(--border)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-dim)' }}>
          <Activity size={14} color="var(--accent)" />
          <span>{isListening ? 'LISTENING' : 'STANDBY'}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 24, fontSize: 12, color: 'var(--text-dim)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Cpu size={14} />
          <span>{systemInfo?.cpus ?? '\u2014'} cores</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Wifi size={14} />
          <span>{systemInfo?.platform ?? '\u2014'}</span>
        </div>
        <div style={{ fontFamily: 'var(--font-hud)', letterSpacing: '0.1em', color: 'var(--text)' }}>
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
      </div>
    </div>
  )
}
