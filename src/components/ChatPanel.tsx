import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mic, Send, Square } from 'lucide-react'
import type { Message } from '../lib/types'

interface Props {
  messages: Message[]
  onSend: (text: string) => void
  isListening: boolean
  setIsListening: (v: boolean) => void
}

export function ChatPanel({ messages, onSend, isListening, setIsListening }: Props) {
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const toggleListen = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      onSend('Speech recognition is not supported in this browser.')
      return
    }
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }
    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
      onSend(transcript)
      setIsListening(false)
    }
    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)
    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    onSend(input)
    setInput('')
  }

  return (
    <div className="panel chat-panel">
      <div className="panel-header">
        <span className="dot" />
        Conversation
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 14px 10px', display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
        {messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ maxWidth: '94%', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start' }}
          >
            <div style={{ fontFamily: 'var(--font-hud)', fontSize: 9, letterSpacing: '0.16em', color: m.role === 'user' ? 'var(--text-dim)' : 'var(--accent)', marginBottom: 4, textAlign: m.role === 'user' ? 'right' : 'left' }}>
              {m.role === 'assistant' ? 'JARVIS' : 'YOU'}
            </div>
            <div style={{
              background: m.role === 'user' ? 'rgba(255,255,255,0.05)' : 'rgba(0, 200, 255, 0.07)',
              border: `1px solid ${m.role === 'user' ? 'rgba(255,255,255,0.08)' : 'rgba(0, 200, 255, 0.14)'}`,
              borderRadius: 12, padding: '11px 13px', fontSize: 13.5, lineHeight: 1.5, whiteSpace: 'pre-wrap',
            }}>
              {m.content}
            </div>
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSubmit} style={{ padding: 12, borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
        <button type="button" onClick={toggleListen} style={{
          width: 42, height: 42, borderRadius: 11, border: '1px solid var(--border)',
          background: isListening ? 'var(--danger)' : 'rgba(0, 200, 255, 0.08)',
          color: isListening ? '#fff' : 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          {isListening ? <Square size={15} /> : <Mic size={16} />}
        </button>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask Jarvis anything\u2026"
          style={{ flex: 1, background: 'rgba(0,0,0,0.35)', border: '1px solid var(--border)', borderRadius: 11, padding: '0 14px', color: 'var(--text)', fontSize: 14, outline: 'none' }} />
        <button type="submit" style={{
          width: 42, height: 42, borderRadius: 11, border: '1px solid var(--border)',
          background: 'rgba(0, 200, 255, 0.1)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <Send size={16} />
        </button>
      </form>
    </div>
  )
}
