import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { downloadFile, fetchThumbnailBlobUrl } from '../../api/videos'
import type { Video } from '../../types'
import { formatDate, formatDuration, isProcessing } from '../../utils/format'
import { StatusBadge } from '../ui/StatusBadge'
import { Button } from '../ui/Button'

export function VideoCard({
  video,
  onDelete,
}: {
  video: Video
  onDelete?: (id: string) => void
}) {
  const [thumb, setThumb] = useState<string | null>(null)

  useEffect(() => {
    if (!video.thumbnail_url) return
    let url: string | null = null
    let cancelled = false
    fetchThumbnailBlobUrl(video.thumbnail_url).then((u) => {
      if (cancelled) {
        if (u) URL.revokeObjectURL(u)
        return
      }
      url = u
      setThumb(u)
    })
    return () => {
      cancelled = true
      if (url) URL.revokeObjectURL(url)
    }
  }, [video.thumbnail_url])

  return (
    <article className="group overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-slate-200/80 transition hover:shadow-md">
      <Link to={`/videos/${video.id}`} className="block">
        <div className="relative aspect-video overflow-hidden bg-slate-100">
          {thumb ? (
            <img src={thumb} alt="" className="h-full w-full object-cover transition group-hover:scale-[1.02]" />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400">
              <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z" />
              </svg>
            </div>
          )}
          {isProcessing(video.status) && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px]">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            </div>
          )}
        </div>
      </Link>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link to={`/videos/${video.id}`} className="block truncate font-medium text-slate-900 hover:text-brand-700">
              {video.original_filename}
            </Link>
            <p className="mt-0.5 text-xs text-slate-500">
              {formatDuration(video.duration)} · {formatDate(video.created_at)}
            </p>
          </div>
          <StatusBadge status={video.status} />
        </div>

        {video.status === 'failed' && video.error_message && (
          <p className="line-clamp-2 text-xs text-rose-600">{video.error_message}</p>
        )}

        <div className="flex flex-wrap gap-2">
          {video.has_video && (
            <Button
              variant="secondary"
              className="!px-3 !py-1.5 text-xs"
              onClick={() => downloadFile('video', video.id, `${video.original_filename}_subtitled.mp4`)}
            >
              Video
            </Button>
          )}
          {video.has_srt && (
            <Button
              variant="secondary"
              className="!px-3 !py-1.5 text-xs"
              onClick={() => downloadFile('srt', video.id, `${video.original_filename}.srt`)}
            >
              SRT
            </Button>
          )}
          {video.has_vtt && (
            <Button
              variant="secondary"
              className="!px-3 !py-1.5 text-xs"
              onClick={() => downloadFile('vtt', video.id, `${video.original_filename}.vtt`)}
            >
              VTT
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              className="!px-3 !py-1.5 text-xs text-rose-600 hover:!bg-rose-50"
              onClick={() => onDelete(video.id)}
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}
