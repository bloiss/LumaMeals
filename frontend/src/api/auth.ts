import type { RegisterRequest, LoginRequest, AuthResponse } from '../types/api'

const API_BASE = 'http://localhost:8080/api/v1'

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
  } catch {
    throw new ApiError('Impossible de contacter le serveur.')
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: 'Erreur inconnue' }))
    throw new ApiError(body.error ?? `Erreur HTTP ${response.status}`, response.status)
  }

  return response.json() as Promise<T>
}

export async function register(req: RegisterRequest): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(req),
  })
}

export async function login(req: LoginRequest): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(req),
  })
}
