import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { getErrorMessage } from '../api/client'
import { uploadVideo } from '../api/videos'
import { UploadDropzone } from '../components/upload/UploadDropzone'

export function UploadPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File) {
    setError(null)
    setUploading(true)
    setProgress(0)
    try {
      const video = await uploadVideo(file, setProgress)
      await queryClient.invalidateQueries({ queryKey: ['videos'] })
      await queryClient.invalidateQueries({ queryKey: ['stats'] })
      navigate(`/videos/${video.id}`)
    } catch (err) {
      setError(getErrorMessage(err, 'Upload failed.'))
      setUploading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900">
          New upload
        </h1>
        <p className="mt-1 text-slate-500">
          After upload, we extract audio, recognize Turkmen speech, build SRT/VTT, and burn
          subtitles into MP4.
        </p>
      </div>

      <UploadDropzone
        onFile={handleFile}
        uploading={uploading}
        progress={progress}
        error={error}
      />

      <ol className="grid gap-3 sm:grid-cols-2">
        {[
          'Extract audio with FFmpeg',
          'Recognize Turkmen speech (Whisper)',
          'Generate SRT, VTT & ASS',
          'Burn styled subtitles into MP4',
        ].map((step, i) => (
          <li
            key={step}
            className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm text-slate-600 ring-1 ring-slate-200/80"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-xs font-semibold text-brand-700">
              {i + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>
    </div>
  )
}
