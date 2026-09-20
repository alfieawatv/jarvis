import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, Plus } from 'lucide-react'
import { ArcReactor } from './components/ArcReactor'
import { StatusBar } from './components/StatusBar'
import { ChatPanel } from './components/ChatPanel'
import { ThemeSwitcher } from './components/ThemeSwitcher'
import { BootSequence } from './components/BootSequence'
import { SettingsModal } from './components/SettingsModal'
import { DraggableWidget } from './components/DraggableWidget'
import { CameraPanel } from './components/panels/CameraPanel'
import { NotesPanel } from './components/panels/NotesPanel'
import { ImageGenPanel } from './components/panels/ImageGenPanel'
import { HomeAssistantPanel } from './components/panels/HomeAssistantPanel'
import { PdfPanel } from './components/panels/PdfPanel'
import { getSystemInfo, processUserMessage } from './lib/tools'
import type { ThemeId, Message, SystemInfo, AppSettings, WidgetConfig } from './lib/types'
import './App.css'

const defaultWidgets: WidgetConfig[] = [
  { id: 'sys', type: 'system', x: 20, y: 70, width: 260, height: 180, title: 'System' },
  { id: 'clock', type: 'clock', x: 20, y: 270, width: 260, height: 110, title: 'Clock' },
]

function App() {
  const [booting, setBooting] = useState(true)
  const [theme, setTheme] = useState<ThemeId>('arc')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Good evening. All systems are online. How may I assist you?',
      timestamp: new Date(),
    },
  ])
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settings, setSettings] = useState<AppSettings>({
    openaiKey: '',
    elevenLabsKey: '',
    ollamaBase: 'http://127.0.0.1:11434',
    ollamaModel: 'llama3.2',
    voiceBackend: 'browser',
    haUrl: '',
    haToken: '',
  })
  const [widgets, setWidgets] = useState<WidgetConfig[]>(defaultWidgets)
  const [addMenuOpen, setAddMenuOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setBooting(false), 2800)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    getSystemInfo().then(setSystemInfo).catch(console.error)
  }, [])

  const addMessage = useCallback((role: Message['role'], content: string) => {
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role, content, timestamp: new Date() },
    ])
  }, [])

  const handleSend = useCallback(
    async (text: string) => {
      if (!text.trim()) return
      addMessage('user', text)
      const reply = await processUserMessage(text, systemInfo)
      setTimeout(() => addMessage('assistant', reply), 500)
    },
    [addMessage, systemInfo]
  )

  const updateWidget = (c: WidgetConfig) => {
    setWidgets((prev) => prev.map((w) => (w.id === c.id ? c : w)))
  }

  const removeWidget = (id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id))
  }

  const addWidget = (type: WidgetConfig['type'], title: string) => {
    const id = crypto.randomUUID()
    setWidgets((prev) => [
      ...prev,
      { id, type, title, x: 80 + prev.length * 20, y: 100 + prev.length * 20, width: 280, height: 220 },
    ])
    setAddMenuOpen(false)
  }

  const renderWidgetBody = (w: WidgetConfig) => {
    switch (w.type) {
      case 'system':
        return (
          <div style={{ fontSize: 13, color: 'var(--text-dim)', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div>Platform: {systemInfo?.platform ?? '\u2014'}</div>
            <div>Host: {systemInfo?.hostname ?? '\u2014'}</div>
            <div>CPUs: {systemInfo?.cpus ?? '\u2014'}</div>
          </div>
        )
      case 'clock':
        return <LiveClock />
      case 'camera':
        return <CameraPanel />
      case 'notes':
        return <NotesPanel />
      case 'imagegen':
        return <ImageGenPanel openaiKey={settings.openaiKey} />
      case 'pdf':
        return <PdfPanel />
      case 'homeassistant':
        return <HomeAssistantPanel haUrl={settings.haUrl} haToken={settings.haToken} />
      default:
        return null
    }
  }

  return (
    <div className={`app theme-${theme}`}>
      <AnimatePresence>{booting && <BootSequence key="boot" onComplete={() => setBooting(false)} />}</AnimatePresence>

      {!booting && (
        <motion.div className="hud" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
          <div className="hud-grid" />
          <StatusBar systemInfo={systemInfo} isListening={isListening} />

          <div className="fab-row">
            <button className="fab" onClick={() => setSettingsOpen(true)} title="Settings">
              <Settings size={18} />
            </button>
            <div style={{ position: 'relative' }}>
              <button className="fab" onClick={() => setAddMenuOpen((v) => !v)} title="Add widget">
                <Plus size={18} />
              </button>
              {addMenuOpen && (
                <div className="add-menu panel">
                  {[
                    { type: 'camera' as const, title: 'Camera' },
                    { type: 'notes' as const, title: 'Notes' },
                    { type: 'imagegen' as const, title: 'Image Gen' },
                    { type: 'pdf' as const, title: 'PDF Viewer' },
                    { type: 'homeassistant' as const, title: 'Home Assistant' },
                    { type: 'system' as const, title: 'System' },
                    { type: 'clock' as const, title: 'Clock' },
                  ].map((item) => (
                    <button key={item.type} className="quick-btn" onClick={() => addWidget(item.type, item.title)}>
                      {item.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="reactor-wrap">
            <ArcReactor active={isListening} />
          </div>

          <div className="widgets-layer">
            {widgets.map((w) => (
              <DraggableWidget key={w.id} config={w} onChange={updateWidget} onClose={removeWidget}>
                {renderWidgetBody(w)}
              </DraggableWidget>
            ))}
          </div>

          <ChatPanel
            messages={messages}
            onSend={handleSend}
            isListening={isListening}
            setIsListening={setIsListening}
          />

          <ThemeSwitcher theme={theme} onChange={setTheme} />
        </motion.div>
      )}

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} onSave={setSettings} />
    </div>
  )
}

function LiveClock() {
  const [t, setT] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-hud)', fontSize: 26, color: 'var(--accent)', letterSpacing: '0.05em' }}>
        {t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>
        {t.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
      </div>
    </div>
  )
}

export default App
