import { useState, useEffect } from 'react'

export function NotesPanel() {
  const [text, setText] = useState(() => localStorage.getItem('jarvis-notes') || '')

  useEffect(() => {
    localStorage.setItem('jarvis-notes', text)
  }, [text])

  return (
    <textarea
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="Notes appear here…"
      style={{
        width: '100%',
        height: '100%',
        minHeight: 120,
        background: 'rgba(0,0,0,0.3)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: 10,
        color: 'var(--text)',
        fontSize: 13,
        resize: 'none',
        outline: 'none',
        fontFamily: 'var(--font-body)',
      }}
    />
  )
}
