import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { fetchMe, login as apiLogin, register as apiRegister } from '../api/auth'
import type { User } from '../types'
import { AUTH_DISABLED } from '../utils/constants'

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
}

const GUEST_USER: User = {
  id: 'guest',
  email: 'guest@local.test',
  created_at: new Date().toISOString(),
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(AUTH_DISABLED ? GUEST_USER : null)
  const [loading, setLoading] = useState(!AUTH_DISABLED)

  useEffect(() => {
    if (AUTH_DISABLED) {
      setUser(GUEST_USER)
      setLoading(false)
      return
    }
    const token = localStorage.getItem('access_token')
    if (!token) {
      setLoading(false)
      return
    }
    fetchMe()
      .then(setUser)
      .catch(() => localStorage.removeItem('access_token'))
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    if (AUTH_DISABLED) {
      setUser(GUEST_USER)
      return
    }
    const { access_token } = await apiLogin(email, password)
    localStorage.setItem('access_token', access_token)
    const me = await fetchMe()
    setUser(me)
  }, [])

  const register = useCallback(async (email: string, password: string) => {
    if (AUTH_DISABLED) {
      setUser(GUEST_USER)
      return
    }
    await apiRegister(email, password)
    const { access_token } = await apiLogin(email, password)
    localStorage.setItem('access_token', access_token)
    const me = await fetchMe()
    setUser(me)
  }, [])

  const logout = useCallback(() => {
    if (AUTH_DISABLED) return
    localStorage.removeItem('access_token')
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
