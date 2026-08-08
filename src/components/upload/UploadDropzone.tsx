import { useCallback, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ACCEPTED_EXTENSIONS, MAX_UPLOAD_BYTES } from '../../utils/constants'
import { formatBytes } from '../../utils/format'
import { Button } from '../ui/Button'

interface UploadDropzoneProps {
  onFile: (file: File) => void
  uploading?: boolean
  progress?: number
  error?: string | null
}

export function UploadDropzone({ onFile, uploading, progress = 0, error }: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const validate = useCallback((file: File): string | null => {
    const ext = '.' + (file.name.split('.').pop() || '').toLowerCase()
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      return `Video format unsupported. Allowed: ${ACCEPTED_EXTENSIONS.map((e) => e.slice(1).toUpperCase()).join(', ')}.`
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      return `Video too large. Maximum size is ${formatBytes(MAX_UPLOAD_BYTES)}.`
    }
    return null
  }, [])

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file) return
      const err = validate(file)
      setLocalError(err)
      if (err) return
      onFile(file)
    },
    [onFile, validate],
  )

  return (
    <div className="space-y-3">
      <motion.div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          handleFile(e.dataTransfer.files?.[0])
        }}
        animate={{
          scale: dragOver ? 1.01 : 1,
          borderColor: dragOver ? 'rgb(99 102 241)' : 'rgb(226 232 240)',
        }}
        className="relative flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed bg-gradient-to-b from-white to-brand-50/40 px-6 py-12 text-center shadow-sm"
        onClick={() => !uploading && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={ACCEPTED_EXTENSIONS.join(',')}
          onChange={(e) => handleFile(e.target.files?.[0])}
          disabled={uploading}
        />

        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/30">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
        </div>

        <h3 className="font-display text-xl font-semibold text-slate-900">
          {uploading ? 'Uploading…' : 'Drop your video here'}
        </h3>
        <p className="mt-2 max-w-md text-sm text-slate-500">
          MP4, MOV, AVI, MKV, WEBM · up to {formatBytes(MAX_UPLOAD_BYTES)}. Turkmen speech will be
          recognized automatically.
        </p>

        {!uploading && (
          <Button
            type="button"
            className="mt-6"
            onClick={(e) => {
              e.stopPropagation()
              inputRef.current?.click()
            }}
          >
            Choose file
          </Button>
        )}

        {uploading && (
          <div className="mt-8 w-full max-w-sm">
            <div className="mb-2 flex justify-between text-xs text-slate-500">
              <span>Upload progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </motion.div>

      {(localError || error) && (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">
          {localError || error}
        </p>
      )}
    </div>
  )
}
