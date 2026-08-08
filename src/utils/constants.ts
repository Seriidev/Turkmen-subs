/** Brand / product name — change here to rebrand. */
export const APP_NAME = 'Turkmen Subtitle AI'
export const APP_TAGLINE = 'AI subtitles optimized for Turkmen speech'

/** Temporary: skip login/register while testing the converter. */
export const AUTH_DISABLED = true

export const MAX_UPLOAD_BYTES = 500 * 1024 * 1024
export const ACCEPTED_VIDEO_TYPES = [
  'video/mp4',
  'video/quicktime',
  'video/x-msvideo',
  'video/x-matroska',
  'video/webm',
]
export const ACCEPTED_EXTENSIONS = ['.mp4', '.mov', '.avi', '.mkv', '.webm']

/** API base — empty uses Vite proxy in dev; Docker nginx proxies /api. */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''
