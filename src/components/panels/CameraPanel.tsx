import { useEffect, useRef, useState } from 'react'
import { Camera, CameraOff } from 'lucide-react'

export function CameraPanel() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [active, setActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setActive(true)
      setError(null)
    } catch (e: any) {
      setError(e.message || 'Camera access denied')
      setActive(false)
    }
  }

  const stop = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    setActive(false)
  }

  useEffect(() => () => stop(), [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}>
      <div style={{ flex: 1, background: '#000', borderRadius: 8, overflow: 'hidden', position: 'relative', minHeight: 140 }}>
        <video ref={videoRef} muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {!active && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', fontSize: 13 }}>
            Camera off
          </div>
        )}
      </div>
      {error && <div style={{ color: 'var(--danger)', fontSize: 12 }}>{error}</div>}
      <button className="quick-btn" onClick={active ? stop : start} style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
        {active ? <><CameraOff size={14} /> Stop</> : <><Camera size={14} /> Start Camera</>}
      </button>
    </div>
  )
}
