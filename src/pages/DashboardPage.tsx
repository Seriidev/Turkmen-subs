import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteVideo } from '../api/videos'
import { StatCard } from '../components/ui/StatCard'
import { Button } from '../components/ui/Button'
import { VideoCard } from '../components/video/VideoCard'
import { useStats, useVideos } from '../hooks/useVideos'
import { formatBytes } from '../utils/format'

export function DashboardPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: stats, isLoading: statsLoading } = useStats()
  const { data: videos, isLoading: videosLoading } = useVideos()

  const remove = useMutation({
    mutationFn: deleteVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
    },
  })

  const recent = videos?.items.slice(0, 6) ?? []

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="mt-1 text-slate-500">Upload a video and get Turkmen subtitles automatically.</p>
        </div>
        <Button onClick={() => navigate('/upload')}>New Upload</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total videos"
          value={statsLoading ? '—' : String(stats?.total_videos ?? 0)}
          icon={<IconFilm />}
        />
        <StatCard
          label="Completed"
          value={statsLoading ? '—' : String(stats?.completed ?? 0)}
          icon={<IconCheck />}
        />
        <StatCard
          label="Processing"
          value={statsLoading ? '—' : String(stats?.processing ?? 0)}
          icon={<IconSpinner />}
        />
        <StatCard
          label="Storage used"
          value={statsLoading ? '—' : formatBytes(stats?.storage_used_bytes)}
          hint={stats ? `of ${formatBytes(stats.storage_limit_bytes)} soft limit` : undefined}
          icon={<IconStorage />}
        />
      </div>

      <section
        onClick={() => navigate('/upload')}
        className="cursor-pointer rounded-3xl border border-dashed border-brand-200 bg-gradient-to-br from-white to-brand-50/50 p-8 text-center shadow-sm transition hover:border-brand-400"
      >
        <h2 className="font-display text-xl font-semibold text-slate-900">Drop a video to start</h2>
        <p className="mt-2 text-sm text-slate-500">
          MP4 · MOV · AVI · MKV · WEBM — max 500 MB. Speech recognition runs in Turkmen.
        </p>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-slate-900">Recent uploads</h2>
          <Button variant="ghost" onClick={() => navigate('/history')}>
            View all
          </Button>
        </div>

        {videosLoading && (
          <p className="text-sm text-slate-500">Loading history…</p>
        )}

        {!videosLoading && recent.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center ring-1 ring-slate-200/80">
            <p className="text-slate-600">No videos yet. Upload your first clip to generate subtitles.</p>
            <Button className="mt-4" onClick={() => navigate('/upload')}>
              Upload video
            </Button>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {recent.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onDelete={(id) => {
                if (confirm('Delete this video and its files?')) remove.mutate(id)
              }}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

function IconFilm() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
    </svg>
  )
}
function IconCheck() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
function IconSpinner() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  )
}
function IconStorage() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
    </svg>
  )
}
