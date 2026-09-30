'use client'

import { useEffect, useRef, useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import type { EmailOtpType } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

export default function RecoveryHandler() {
  const started = useRef(false)
  const [message, setMessage] = useState('Validando seu link de acesso...')
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    async function recoverSession() {
      try {
        const url = new URL(window.location.href)
        const hash = new URLSearchParams(url.hash.slice(1))
        const errorDescription = url.searchParams.get('error_description') ?? hash.get('error_description')
        if (errorDescription) throw new Error(errorDescription)

        const code = url.searchParams.get('code')
        const tokenHash = url.searchParams.get('token_hash')
        const type = url.searchParams.get('type') as EmailOtpType | null
        const accessToken = hash.get('access_token')
        const refreshToken = hash.get('refresh_token')

        if (code || (tokenHash && type)) {
          const callbackUrl = new URL('/admin/auth/callback', url.origin)
          if (code) callbackUrl.searchParams.set('code', code)
          if (tokenHash) callbackUrl.searchParams.set('token_hash', tokenHash)
          if (type) callbackUrl.searchParams.set('type', type)
          callbackUrl.searchParams.set('next', '/admin/reset-password')
          window.location.replace(callbackUrl.toString())
          return
        }

        const supabase = createClient()
        const sessionPromise = accessToken && refreshToken
          ? supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })
          : supabase.auth.getSession()

        const result = await Promise.race([
          sessionPromise,
          new Promise<never>((_, reject) => window.setTimeout(
            () => reject(new Error('Tempo limite de validacao excedido.')),
            12_000,
          )),
        ])

        if (result.error || !result.data.session) {
          throw result.error ?? new Error('Sessao de recuperacao ausente.')
        }

        window.history.replaceState({}, '', url.pathname)
        window.location.replace('/admin/reset-password')
      } catch {
        setFailed(true)
        setMessage('Este link expirou ou não é válido. Volte ao login e solicite um novo link.')
      }
    }

    void recoverSession()
  }, [])

  return <div className="admin-auth-form">
    <p className={`admin-alert ${failed ? 'error' : 'success'}`} role="status">
      {!failed && <LoaderCircle className="admin-spin" />} {message}
    </p>
    {failed && <a className="admin-secondary" href="/admin/login">Voltar ao login</a>}
  </div>
}
