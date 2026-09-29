'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LoaderCircle } from 'lucide-react'
import type { EmailOtpType } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

export default function RecoveryHandler() {
  const router = useRouter()
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

        const supabase = createClient()
        const code = url.searchParams.get('code')
        const tokenHash = url.searchParams.get('token_hash')
        const type = url.searchParams.get('type') as EmailOtpType | null
        const accessToken = hash.get('access_token')
        const refreshToken = hash.get('refresh_token')

        async function requireSession(authError?: Error | null) {
          const { data, error } = await supabase.auth.getSession()
          if (data.session) return

          throw authError ?? error ?? new Error('Sessao de recuperacao ausente.')
        }

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          await requireSession(error)
        } else if (tokenHash && type) {
          const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
          await requireSession(error)
        } else if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })
          await requireSession(error)
        } else {
          await requireSession()
        }

        window.history.replaceState({}, '', url.pathname)
        router.replace('/admin/reset-password')
        router.refresh()
      } catch {
        setFailed(true)
        setMessage('Este link expirou ou não é válido. Volte ao login e solicite um novo link.')
      }
    }

    void recoverSession()
  }, [router])

  return <div className="admin-auth-form">
    <p className={`admin-alert ${failed ? 'error' : 'success'}`} role="status">
      {!failed && <LoaderCircle className="admin-spin" />} {message}
    </p>
    {failed && <a className="admin-secondary" href="/admin/login">Voltar ao login</a>}
  </div>
}
