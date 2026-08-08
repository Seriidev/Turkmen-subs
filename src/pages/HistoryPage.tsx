import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteVideo } from '../api/videos'
import { VideoCard } from '../components/video/VideoCard'
import { useVideos } from '../hooks/useVideos'
import { formatBytes } from '../utils/format'

export function HistoryPage() {
  const queryClient = useQueryClient()
  const { data, isLoading } = useVideos()

  const remove = useMutation({
    mutationFn: deleteVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
    },
  })

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900">
            Processing history
          </h1>
          <p className="mt-1 text-slate-500">
            {data
              ? `${data.total} videos · ${formatBytes(data.storage_used_bytes)} used`
              : 'Your past uploads and downloads'}
          </p>
        </div>
      </div>

      {isLoading && <p className="text-sm text-slate-500">Loading…</p>}

      {!isLoading && (data?.items.length ?? 0) === 0 && (
        <div className="rounded-2xl bg-white p-10 text-center ring-1 ring-slate-200/80">
          <p className="text-slate-600">No processing history yet.</p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {data?.items.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onDelete={(id) => {
              if (confirm('Delete this video and its files?')) remove.mutate(id)
            }}
          />
        ))}
      </div>
    </div>
  )
}
