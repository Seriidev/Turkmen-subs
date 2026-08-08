import axios from 'axios'
import { API_BASE_URL } from '../utils/constants'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    // Auth is temporarily disabled for converter testing — never bounce to login.
    return Promise.reject(error)
  },
)

export function getErrorMessage(error: unknown, fallback = 'Something went wrong.'): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Backend is not running. Start the API server on port 8000, then try again.'
    }
    const detail = error.response.data?.detail
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg
    if (error.response.status >= 500) {
      return 'Server error. Make sure the backend and database are running.'
    }
  }
  if (error instanceof Error) return error.message
  return fallback
}
