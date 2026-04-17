import type { GenerateRequest, GenerateResult, Recipe, Supermarket } from '../types/api'

const API_BASE = 'http://localhost:8080/api/v1'

// Erreur typée pour distinguer les erreurs réseau des erreurs API
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
    throw new ApiError('Impossible de contacter le serveur. Vérifie que le backend est lancé.')
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: 'Erreur inconnue' }))
    throw new ApiError(body.error ?? `Erreur HTTP ${response.status}`, response.status)
  }

  return response.json() as Promise<T>
}

// POST /api/v1/meals/generate — requiert un JWT dans Authorization: Bearer
// budget_cents et les prix retournés sont toujours des entiers en centimes
export async function postGenerate(req: GenerateRequest, token: string): Promise<GenerateResult> {
  return apiFetch<GenerateResult>('/meals/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(req),
  })
}

// GET /api/v1/recipes
export async function getRecipes(): Promise<Recipe[]> {
  return apiFetch<Recipe[]>('/recipes')
}

// GET /api/v1/supermarkets
export async function getSupermarkets(): Promise<Supermarket[]> {
  return apiFetch<Supermarket[]>('/supermarkets')
}
