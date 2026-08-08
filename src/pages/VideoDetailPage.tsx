import { Link, useParams } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteVideo, downloadFile } from '../api/videos'
import { Button } from '../components/ui/Button'
import { StatusBadge } from '../components/ui/StatusBadge'
import { VideoPlayer } from '../components/video/VideoPlayer'
import { useVideo } from '../hooks/useVideos'
import { formatDate, formatDuration, isProcessing, STATUS_LABELS } from '../utils/format'
import { useNavigate } from 'react-router-dom'

const PIPELINE = [
  'queued',
  'extracting_audio',
  'recognizing_speech',
  'generating_subtitle',
  'rendering_video',
  'completed',
] as const

export function VideoDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: video, isLoading, error } = useVideo(id)

  const remove = useMutation({
    mutationFn: deleteVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] })
      navigate('/history')
    },
  })

  if (isLoading) {
    return <p className="text-sm text-slate-500">Loading video…</p>
  }

  if (error || !video) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center ring-1 ring-slate-200">
        <p className="text-slate-600">Video not found.</p>
        <Link to="/dashboard" className="mt-3 inline-block text-brand-600">
          Back to dashboard
        </Link>
      </div>
    )
  }

  const activeIdx = PIPELINE.indexOf(video.status as (typeof PIPELINE)[number])

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link to="/history" className="text-sm text-brand-600 hover:text-brand-700">
            ← History
          </Link>
          <h1 className="mt-2 font-display text-2xl font-semibold text-slate-900 sm:text-3xl">
            {video.original_filename}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <StatusBadge status={video.status} />
            <span>{formatDuration(video.duration)}</span>
            <span>{formatDate(video.created_at)}</span>
            {video.processing_time_seconds != null && (
              <span>Processed in {video.processing_time_seconds.toFixed(1)}s</span>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          className="text-rose-600 hover:!bg-rose-50"
          onClick={() => {
            if (confirm('Delete this video?')) remove.mutate(video.id)
          }}
        >
          Delete
        </Button>
      </div>

      {isProcessing(video.status) && (
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
            <p className="font-medium text-slate-800">{STATUS_LABELS[video.status]}…</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-5">
            {PIPELINE.slice(0, -1).map((step, i) => {
              const done = activeIdx > i || video.status === 'completed'
              const current = video.status === step
              return (
                <div
                  key={step}
                  className={`rounded-xl px-3 py-2 text-xs font-medium ${
                    done
                      ? 'bg-emerald-50 text-emerald-700'
                      : current
                        ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-200'
                        : 'bg-slate-50 text-slate-400'
                  }`}
                >
                  {STATUS_LABELS[step]}
                </div>
              )
            })}
          </div>
          <p className="mt-3 text-xs text-slate-400">Status updates live every few seconds.</p>
        </div>
      )}

      {video.status === 'failed' && (
        <div className="rounded-2xl bg-rose-50 px-5 py-4 text-sm text-rose-700 ring-1 ring-rose-200">
          {video.error_message || 'Processing failed.'}
        </div>
      )}

      {video.status === 'completed' && video.has_video && (
        <VideoPlayer
          videoId={video.id}
          title={video.original_filename}
          onDownloadVideo={() =>
            downloadFile('video', video.id, `${video.original_filename}_subtitled.mp4`)
          }
          onDownloadSrt={
            video.has_srt
              ? () => downloadFile('srt', video.id, `${video.original_filename}.srt`)
              : undefined
          }
          onDownloadVtt={
            video.has_vtt
              ? () => downloadFile('vtt', video.id, `${video.original_filename}.vtt`)
              : undefined
          }
        />
      )}

      {video.status === 'completed' && (
        <div className="flex flex-wrap gap-3">
          {video.has_video && (
            <Button
              onClick={() =>
                downloadFile('video', video.id, `${video.original_filename}_subtitled.mp4`)
              }
            >
              Download Video
            </Button>
          )}
          {video.has_srt && (
            <Button
              variant="secondary"
              onClick={() => downloadFile('srt', video.id, `${video.original_filename}.srt`)}
            >
              Download SRT
            </Button>
          )}
          {video.has_vtt && (
            <Button
              variant="secondary"
              onClick={() => downloadFile('vtt', video.id, `${video.original_filename}.vtt`)}
            >
              Download VTT
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
