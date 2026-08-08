import { useEffect, useRef, useState } from 'react'
import { fetchStreamBlobUrl } from '../../api/videos'
import { Button } from '../ui/Button'

interface VideoPlayerProps {
  videoId: string
  title?: string
  onDownloadVideo?: () => void
  onDownloadSrt?: () => void
  onDownloadVtt?: () => void
}

export function VideoPlayer({
  videoId,
  title,
  onDownloadVideo,
  onDownloadSrt,
  onDownloadVtt,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [src, setSrc] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [subsOn, setSubsOn] = useState(true)

  useEffect(() => {
    let url: string | null = null
    let cancelled = false
    setSrc(null)
    setError(null)
    fetchStreamBlobUrl(videoId)
      .then((u) => {
        if (cancelled) {
          URL.revokeObjectURL(u)
          return
        }
        url = u
        setSrc(u)
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message)
      })
    return () => {
      cancelled = true
      if (url) URL.revokeObjectURL(url)
    }
  }, [videoId])

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    Array.from(el.textTracks).forEach((track) => {
      track.mode = subsOn ? 'showing' : 'hidden'
    })
  }, [subsOn, src])

  return (
    <div className="overflow-hidden rounded-2xl bg-slate-950 shadow-xl ring-1 ring-slate-800">
      <div className="relative aspect-video bg-black">
        {src ? (
          <video
            ref={videoRef}
            src={src}
            className="h-full w-full"
            controls
            playsInline
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            {error || 'Loading preview…'}
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-slate-900/90 px-4 py-3">
        <div>
          <p className="text-sm font-medium text-white">{title || 'Preview'}</p>
          <p className="text-xs text-slate-400">Subtitles are burned into this export</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" className="!bg-slate-800 !text-slate-100 !ring-slate-700" onClick={() => setSubsOn((v) => !v)}>
            Subtitles {subsOn ? 'On' : 'Off'}
          </Button>
          {onDownloadVideo && (
            <Button onClick={onDownloadVideo}>Download Video</Button>
          )}
          {onDownloadSrt && (
            <Button variant="secondary" className="!bg-slate-800 !text-slate-100 !ring-slate-700" onClick={onDownloadSrt}>
              SRT
            </Button>
          )}
          {onDownloadVtt && (
            <Button variant="secondary" className="!bg-slate-800 !text-slate-100 !ring-slate-700" onClick={onDownloadVtt}>
              VTT
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
