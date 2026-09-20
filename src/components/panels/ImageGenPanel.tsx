import { useState } from 'react'
import { Sparkles } from 'lucide-react'

interface Props {
  openaiKey?: string
}

export function ImageGenPanel({ openaiKey }: Props) {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const generate = async () => {
    if (!prompt.trim()) return
    if (!openaiKey) {
      setError('Add your OpenAI API key in Settings first.')
      return
    }
    setLoading(true)
    setError(null)
    setImageUrl(null)
    try {
      const res = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt,
          n: 1,
          size: '1024x1024',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error?.message || 'Generation failed')
      setImageUrl(data.data[0].url)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe an image\u2026"
        rows={2}
        style={{
          width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)',
          borderRadius: 8, padding: 8, color: 'var(--text)', fontSize: 13, resize: 'none', outline: 'none',
        }}
      />
      <button className="quick-btn" onClick={generate} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
        <Sparkles size={14} /> {loading ? 'Generating\u2026' : 'Generate'}
      </button>
      {error && <div style={{ color: 'var(--danger)', fontSize: 12 }}>{error}</div>}
      {imageUrl && (
        <img src={imageUrl} alt="Generated" style={{ width: '100%', borderRadius: 8, border: '1px solid var(--border)' }} />
      )}
    </div>
  )
}
