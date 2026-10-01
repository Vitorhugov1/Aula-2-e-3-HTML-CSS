'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Copy, LoaderCircle, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Enrollment = {
  factorId: string
  qrCode: string
  secret: string
}

export default function MfaForm() {
  const router = useRouter()
  const [factorId, setFactorId] = useState('')
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let active = true

    async function prepareMfa() {
      const supabase = createClient()
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        router.replace('/admin/login')
        return
      }

      const { data: admin } = await supabase.from('admin_users').select('user_id').maybeSingle()
      if (!admin) {
        await supabase.auth.signOut()
        router.replace('/admin/login?error=unauthorized')
        return
      }

      const { data: assurance } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
      if (assurance?.currentLevel === 'aal2') {
        router.replace('/admin')
        router.refresh()
        return
      }

      const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors()
      if (factorsError) throw factorsError
      const verified = factors.totp.find((factor) => factor.status === 'verified')
      if (verified) {
        if (active) setFactorId(verified.id)
        return
      }

      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'WP Admin',
      })
      if (error) throw error
      if (active) {
        setFactorId(data.id)
        setEnrollment({ factorId: data.id, qrCode: data.totp.qr_code, secret: data.totp.secret })
      }
    }

    prepareMfa()
      .catch(() => active && setMessage('Não foi possível preparar a verificação. Entre novamente e tente de novo.'))
      .finally(() => active && setLoading(false))

    return () => { active = false }
  }, [router])

  async function verify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!factorId || code.length !== 6) return
    setLoading(true)
    setMessage('')
    const supabase = createClient()
    const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code })
    if (error) {
      setMessage('Código inválido ou expirado. Confira o aplicativo e tente novamente.')
      setLoading(false)
      return
    }
    router.replace('/admin')
    router.refresh()
  }

  async function copySecret() {
    if (!enrollment) return
    await navigator.clipboard.writeText(enrollment.secret)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  if (loading && !factorId) return <div className="admin-mfa-loading"><LoaderCircle className="admin-spin" />Preparando proteção...</div>

  return <form className="admin-auth-form" onSubmit={verify}>
    {enrollment ? <>
      <div className="admin-mfa-setup">
        <img src={enrollment.qrCode} alt="QR Code para configurar o aplicativo autenticador" />
        <p>Escaneie o QR Code no Google Authenticator, Microsoft Authenticator ou aplicativo compatível.</p>
      </div>
      <button className="admin-secondary admin-mfa-secret" type="button" onClick={copySecret}>
        {copied ? <CheckCircle2 /> : <Copy />}{copied ? 'Chave copiada' : 'Copiar chave manual'}
      </button>
    </> : <p className="admin-alert success"><ShieldCheck />Digite o código atual do seu aplicativo autenticador.</p>}
    <label>Código de 6 dígitos<input inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} required disabled={loading} /></label>
    {message && <p className="admin-alert error" role="status">{message}</p>}
    <button className="admin-primary" type="submit" disabled={loading || !factorId || code.length !== 6}>{loading ? <LoaderCircle className="admin-spin" /> : <ShieldCheck />}Verificar e entrar</button>
  </form>
}
