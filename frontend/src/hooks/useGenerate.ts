import { useState } from 'react'
import { postGenerate, ApiError } from '../api/generate'
import type { GenerateRequest, GenerateResult } from '../types/api'

interface UseGenerateState {
  result: GenerateResult | null
  loading: boolean
  error: string | null
}

interface UseGenerateReturn extends UseGenerateState {
  generate: (req: GenerateRequest) => Promise<void>
  reset: () => void
}

export function useGenerate(): UseGenerateReturn {
  const [state, setState] = useState<UseGenerateState>({
    result: null,
    loading: false,
    error: null,
  })

  async function generate(req: GenerateRequest): Promise<void> {
    setState({ result: null, loading: true, error: null })
    try {
      const result = await postGenerate(req)
      setState({ result, loading: false, error: null })
    } catch (err) {
      const message = err instanceof ApiError
        ? err.message
        : 'Une erreur inattendue est survenue.'
      setState({ result: null, loading: false, error: message })
    }
  }

  function reset(): void {
    setState({ result: null, loading: false, error: null })
  }

  return { ...state, generate, reset }
}
