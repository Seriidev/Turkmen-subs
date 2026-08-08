import type { VideoStatus } from '../types'

export function formatBytes(bytes: number | null | undefined): string {
  if (!bytes || bytes <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  let n = bytes
  let i = 0
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024
    i += 1
  }
  return `${n.toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

export function formatDuration(seconds: number | null | undefined): string {
  if (seconds == null || Number.isNaN(seconds)) return '—'
  const s = Math.round(seconds)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  return `${m}:${String(sec).padStart(2, '0')}`
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export const STATUS_LABELS: Record<VideoStatus, string> = {
  uploading: 'Uploading',
  queued: 'Queued',
  extracting_audio: 'Extracting Audio',
  recognizing_speech: 'Recognizing Speech',
  generating_subtitle: 'Generating Subtitle',
  rendering_video: 'Rendering Video',
  completed: 'Completed',
  failed: 'Failed',
}

export function statusTone(status: VideoStatus): string {
  switch (status) {
    case 'completed':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-200'
    case 'failed':
      return 'bg-rose-50 text-rose-700 ring-rose-200'
    case 'uploading':
    case 'queued':
      return 'bg-slate-100 text-slate-600 ring-slate-200'
    default:
      return 'bg-indigo-50 text-indigo-700 ring-indigo-200'
  }
}

export function isProcessing(status: VideoStatus): boolean {
  return !['completed', 'failed'].includes(status)
}
