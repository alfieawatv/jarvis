import { Rnd } from 'react-rnd'
import { X } from 'lucide-react'
import type { WidgetConfig } from '../lib/types'

interface Props {
  config: WidgetConfig
  onChange: (c: WidgetConfig) => void
  onClose: (id: string) => void
  children: React.ReactNode
}

export function DraggableWidget({ config, onChange, onClose, children }: Props) {
  return (
    <Rnd
      size={{ width: config.width, height: config.height }}
      position={{ x: config.x, y: config.y }}
      onDragStop={(_e, d) => onChange({ ...config, x: d.x, y: d.y })}
      onResizeStop={(_e, _dir, ref, _delta, pos) =>
        onChange({
          ...config,
          width: parseInt(ref.style.width, 10),
          height: parseInt(ref.style.height, 10),
          x: pos.x,
          y: pos.y,
        })
      }
      bounds="parent"
      minWidth={200}
      minHeight={120}
      dragHandleClassName="widget-drag-handle"
      style={{ zIndex: 10 }}
    >
      <div className="panel" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div
          className="panel-header widget-drag-handle"
          style={{ cursor: 'grab', justifyContent: 'space-between', userSelect: 'none' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="dot" />
            {config.title}
          </div>
          <button
            onClick={() => onClose(config.id)}
            style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: 2 }}
          >
            <X size={14} />
          </button>
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: '0 12px 12px' }}>{children}</div>
      </div>
    </Rnd>
  )
}
