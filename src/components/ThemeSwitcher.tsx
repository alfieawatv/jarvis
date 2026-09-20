import type { ThemeId } from '../lib/types'

const themes: { id: ThemeId; label: string; color: string }[] = [
  { id: 'arc', label: 'Arc', color: '#00d4ff' },
  { id: 'midnight', label: 'Midnight', color: '#7b61ff' },
  { id: 'crimson', label: 'Crimson', color: '#ff3b5c' },
  { id: 'matrix', label: 'Matrix', color: '#00ff66' },
]

interface Props {
  theme: ThemeId
  onChange: (t: ThemeId) => void
}

export function ThemeSwitcher({ theme, onChange }: Props) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 10,
        zIndex: 20,
        background: 'rgba(5, 7, 10, 0.7)',
        border: '1px solid var(--border)',
        borderRadius: 999,
        padding: '6px 10px',
        backdropFilter: 'blur(12px)',
      }}
    >
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          title={t.label}
          style={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            border: theme === t.id ? `2px solid ${t.color}` : '2px solid transparent',
            background: t.color,
            boxShadow: theme === t.id ? `0 0 12px ${t.color}` : 'none',
            cursor: 'pointer',
            opacity: theme === t.id ? 1 : 0.55,
            transition: 'all 0.2s',
          }}
        />
      ))}
    </div>
  )
}
