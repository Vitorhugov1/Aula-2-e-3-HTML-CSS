'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { KeyRound, LoaderCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { isStrongAdminPassword } from '@/lib/security.mjs'

export default function ResetPasswordForm() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!isStrongAdminPassword(password)) return setMessage('Use 12 caracteres ou mais, com maiúscula, minúscula, número e símbolo.')
    if (password !== confirmation) return setMessage('As senhas não coincidem.')
    setLoading(true)
    setMessage('')
    try {
      const { error } = await createClient().auth.updateUser({ password })
      if (error) throw error
      router.replace('/admin')
      router.refresh()
    } catch {
      setMessage('O link expirou ou não é válido. Solicite uma nova recuperação.')
    } finally {
      setLoading(false)
    }
  }

  return <form className="admin-auth-form" onSubmit={submit}>
    <label>Nova senha<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" minLength={12} maxLength={128} required /></label>
    <label>Confirmar nova senha<input type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} autoComplete="new-password" minLength={12} maxLength={128} required /></label>
    {message && <p className="admin-alert error" role="alert">{message}</p>}
    <button className="admin-primary" disabled={loading}>{loading ? <LoaderCircle className="admin-spin" /> : <KeyRound />}Salvar nova senha</button>
  </form>
}
