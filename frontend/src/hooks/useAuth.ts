import { useState } from 'react'
import { register, login, ApiError } from '../api/auth'
import type { User, RegisterRequest, LoginRequest } from '../types/api'

const TOKEN_KEY = 'luma_token'

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
}

interface UseAuthReturn extends AuthState {
  signUp: (req: RegisterRequest) => Promise<void>
  signIn: (req: LoginRequest) => Promise<void>
  signOut: () => void
  isAuthenticated: boolean
}

function loadToken(): string | null {
  try { return localStorage.getItem(TOKEN_KEY) } catch { return null }
}

export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: loadToken(),
    loading: false,
    error: null,
  })

  async function signUp(req: RegisterRequest): Promise<void> {
    setState(s => ({ ...s, loading: true, error: null }))
    try {
      const res = await register(req)
      localStorage.setItem(TOKEN_KEY, res.token)
      setState({ user: res.user, token: res.token, loading: false, error: null })
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Erreur inattendue'
      setState(s => ({ ...s, loading: false, error: msg }))
    }
  }

  async function signIn(req: LoginRequest): Promise<void> {
    setState(s => ({ ...s, loading: true, error: null }))
    try {
      const res = await login(req)
      localStorage.setItem(TOKEN_KEY, res.token)
      setState({ user: res.user, token: res.token, loading: false, error: null })
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Erreur inattendue'
      setState(s => ({ ...s, loading: false, error: msg }))
    }
  }

  function signOut(): void {
    localStorage.removeItem(TOKEN_KEY)
    setState({ user: null, token: null, loading: false, error: null })
  }

  return {
    ...state,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!state.token,
  }
}
