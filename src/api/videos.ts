import { api } from './client'
import type { DashboardStats, Video, VideoListResponse } from '../types'

export async function fetchStats(): Promise<DashboardStats> {
  const { data } = await api.get<DashboardStats>('/api/stats')
  return data
}

export async function fetchVideos(): Promise<VideoListResponse> {
  const { data } = await api.get<VideoListResponse>('/api/videos')
  return data
}

export async function fetchVideo(id: string): Promise<Video> {
  const { data } = await api.get<Video>(`/api/video/${id}`)
  return data
}

export async function deleteVideo(id: string): Promise<void> {
  await api.delete(`/api/video/${id}`)
}

export async function uploadVideo(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<Video> {
  const form = new FormData()
  form.append('file', file)
  const { data } = await api.post<Video>('/api/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (evt) => {
      if (!evt.total) return
      onProgress?.(Math.round((evt.loaded / evt.total) * 100))
    },
  })
  return data
}

export function downloadUrl(kind: 'video' | 'srt' | 'vtt', id: string): string {
  return `/api/download/${kind}/${id}`
}

export async function downloadFile(kind: 'video' | 'srt' | 'vtt', id: string, filename: string) {
  const token = localStorage.getItem('access_token')
  const res = await fetch(downloadUrl(kind, id), {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.detail || 'Download failed.')
  }
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export async function fetchStreamBlobUrl(id: string): Promise<string> {
  const token = localStorage.getItem('access_token')
  const res = await fetch(`/api/videos/${id}/stream`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (!res.ok) throw new Error('Could not load video stream.')
  const blob = await res.blob()
  return URL.createObjectURL(blob)
}

export async function fetchThumbnailBlobUrl(path: string): Promise<string | null> {
  const token = localStorage.getItem('access_token')
  const res = await fetch(path, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (!res.ok) return null
  const blob = await res.blob()
  return URL.createObjectURL(blob)
}
