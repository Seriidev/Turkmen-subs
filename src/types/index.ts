export type VideoStatus =
  | 'uploading'
  | 'queued'
  | 'extracting_audio'
  | 'recognizing_speech'
  | 'generating_subtitle'
  | 'rendering_video'
  | 'completed'
  | 'failed'

export interface User {
  id: string
  email: string
  created_at: string
}

export interface Subtitle {
  id: string
  video_id: string
  language: string
  format: string
  path: string
  created_at: string
}

export interface Video {
  id: string
  user_id: string
  filename: string
  original_filename: string
  duration: number | null
  status: VideoStatus
  file_size: number | null
  error_message: string | null
  processing_time_seconds: number | null
  has_video: boolean
  has_srt: boolean
  has_vtt: boolean
  thumbnail_url: string | null
  created_at: string
  updated_at: string
  subtitles: Subtitle[]
}

export interface VideoListResponse {
  items: Video[]
  total: number
  storage_used_bytes: number
}

export interface DashboardStats {
  total_videos: number
  completed: number
  processing: number
  failed: number
  storage_used_bytes: number
  storage_limit_bytes: number
}

export interface TokenResponse {
  access_token: string
  token_type: string
}
