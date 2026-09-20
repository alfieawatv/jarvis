export type ThemeId = 'arc' | 'midnight' | 'crimson' | 'matrix'
export type VoiceBackend = 'browser' | 'openai' | 'elevenlabs' | 'ollama'

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system' | 'tool'
  content: string
  timestamp: Date
}

export interface SystemInfo {
  platform: string
  arch?: string
  hostname: string
  cpus: number
  totalMem: number
  freeMem: number
  uptime?: number
  username?: string
}

export interface AppSettings {
  openaiKey: string
  elevenLabsKey: string
  ollamaBase: string
  ollamaModel: string
  voiceBackend: VoiceBackend
  haUrl: string
  haToken: string
}

export interface WidgetConfig {
  id: string
  type: 'system' | 'clock' | 'camera' | 'notes' | 'imagegen' | 'pdf' | 'homeassistant' | 'tools'
  x: number
  y: number
  width: number
  height: number
  title: string
}
