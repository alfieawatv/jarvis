import type { SystemInfo } from './types'

declare global {
  interface Window {
    jarvis?: {
      system: {
        getInfo: () => Promise<SystemInfo>
        openExternal: (url: string) => Promise<{ ok: boolean; error?: string }>
        runCommand: (cmd: string, opts?: { confirmed?: boolean }) => Promise<any>
        confirm: (message: string) => Promise<boolean>
      }
      settings: { get: () => Promise<any>; set: (partial: any) => Promise<any> }
    }
  }
}

export async function getSystemInfo(): Promise<SystemInfo> {
  if (window.jarvis?.system) return window.jarvis.system.getInfo()
  return {
    platform: navigator.platform,
    hostname: 'browser',
    cpus: navigator.hardwareConcurrency || 4,
    totalMem: 0,
    freeMem: 0,
  }
}

export async function openUrl(url: string) {
  if (window.jarvis?.system) return window.jarvis.system.openExternal(url)
  window.open(url, '_blank')
  return { ok: true }
}

export async function processUserMessage(text: string, systemInfo: SystemInfo | null): Promise<string> {
  const lower = text.toLowerCase().trim()

  if (lower.includes('system') && (lower.includes('status') || lower.includes('info'))) {
    if (!systemInfo) return 'System information unavailable.'
    return `Platform: ${systemInfo.platform}\nHost: ${systemInfo.hostname}\nCPUs: ${systemInfo.cpus}`
  }

  if (lower.includes('time') || lower.includes('what time')) {
    return `The current time is ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`
  }

  if (lower.startsWith('search ') || lower.startsWith('search for ') || lower.startsWith('open ')) {
    const query = text.replace(/^(search for|search|open)\s+/i, '').trim()
    await openUrl(`https://www.google.com/search?q=${encodeURIComponent(query)}`)
    return `Opening search for \u201c${query}\u201d.`
  }

  if (lower.includes('help') || lower === '?') {
    return 'I can tell the time, system status, search the web, and more. Open Settings to add API keys.'
  }

  const replies = [
    'Understood. Processing your request\u2026',
    'Of course. I\u2019ll handle that immediately.',
    'Acknowledged. Standing by for further instructions.',
    'Consider it done, sir.',
    'I\u2019m on it. Is there anything else?',
  ]
  return replies[Math.floor(Math.random() * replies.length)]
}
