import { useQuery } from '@tanstack/react-query'
import { fetchStats, fetchVideo, fetchVideos } from '../api/videos'
import type { VideoStatus } from '../types'

const ACTIVE: VideoStatus[] = [
  'uploading',
  'queued',
  'extracting_audio',
  'recognizing_speech',
  'generating_subtitle',
  'rendering_video',
]

export function useVideos() {
  return useQuery({
    queryKey: ['videos'],
    queryFn: fetchVideos,
    refetchInterval: (query) => {
      const items = query.state.data?.items ?? []
      return items.some((v) => ACTIVE.includes(v.status)) ? 2500 : false
    },
  })
}

export function useVideo(id: string | undefined) {
  return useQuery({
    queryKey: ['video', id],
    queryFn: () => fetchVideo(id!),
    enabled: Boolean(id),
    refetchInterval: (query) => {
      const status = query.state.data?.status
      return status && ACTIVE.includes(status) ? 2000 : false
    },
  })
}

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
    refetchInterval: 5000,
  })
}
