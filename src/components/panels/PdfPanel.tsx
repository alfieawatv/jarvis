import { useState } from 'react'
import { FileText } from 'lucide-react'

export function PdfPanel() {
  const [fileName, setFileName] = useState<string | null>(null)
  const [url, setUrl] = useState<string | null>(null)

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type === 'application/pdf') {
      setFileName(file.name)
      setUrl(URL.createObjectURL(file))
    }
  }

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}
    >
      {!url ? (
        <div
          style={{
            flex: 1, border: '1px dashed var(--border)', borderRadius: 8,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-dim)', fontSize: 13, gap: 8, minHeight: 120,
          }}
        >
          <FileText size={28} />
          Drop a PDF here
        </div>
      ) : (
        <>
          <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{fileName}</div>
          <iframe src={url} title="PDF" style={{ flex: 1, width: '100%', border: 'none', borderRadius: 8, minHeight: 160 }} />
        </>
      )}
    </div>
  )
}
