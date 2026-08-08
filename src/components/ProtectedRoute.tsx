import { Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AUTH_DISABLED } from '../utils/constants'

export function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (AUTH_DISABLED) return <Outlet />

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
      </div>
    )
  }

  if (!user) {
    // Keep routes open when auth is off; otherwise redirect handled below without login pages.
    window.location.href = '/dashboard'
    return null
  }
  return <Outlet />
}
