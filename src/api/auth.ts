import { api } from './client'
import type { TokenResponse, User } from '../types'

export async function register(email: string, password: string): Promise<User> {
  const { data } = await api.post<User>('/api/auth/register', { email, password })
  return data
}

export async function login(email: string, password: string): Promise<TokenResponse> {
  const { data } = await api.post<TokenResponse>('/api/auth/login', { email, password })
  return data
}

export async function fetchMe(): Promise<User> {
  const { data } = await api.get<User>('/api/auth/me')
  return data
}
