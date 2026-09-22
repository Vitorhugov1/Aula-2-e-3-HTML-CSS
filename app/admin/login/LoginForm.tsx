'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, LoaderCircle, LogIn } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginForm({ configured, unauthorized }: { configured: boolean; unauthorized: boolean }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(unauthorized ? 'Esta conta não possui permissão administrativa.' : '')
  const [success, setSuccess] = useState(false)

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!configured) return
    setLoading(true)
    setMessage('')
    setSuccess(false)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw new Error('E-mail ou senha incorretos.')
      const { data: admin } = await supabase.from('admin_users').select('user_id').maybeSingle()
      if (!admin) {
        await supabase.auth.signOut()
        throw new Error('Esta conta não possui permissão administrativa.')
      }
      router.replace('/admin')
      router.refresh()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível entrar.')
    } finally {
      setLoading(false)
    }
  }

  async function recoverPassword(firstAccess = false) {
    if (!configured) return
    if (!email) {
      setMessage('Digite seu e-mail para receber o link de criação de senha.')
      return
    }
    setLoading(true)
    setMessage('')
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/auth/callback?next=/admin/reset-password`,
      })
      if (error) throw error
      setSuccess(true)
      setMessage(firstAccess
        ? 'Enviamos o link para você criar sua senha.'
        : 'Enviamos as instruções de recuperação para o seu e-mail.')
    } catch {
      setMessage('Não foi possível enviar o e-mail. Confira o endereço e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return <form className="admin-auth-form" onSubmit={login}>
    {!configured && <p className="admin-alert error">O painel ainda precisa das variáveis do Supabase na Vercel. Consulte o GUIA-ADMIN.md.</p>}
    <label>E-mail<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required disabled={!configured || loading} /></label>
    <label>Senha<span className="admin-password"><input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required disabled={!configured || loading} /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>{showPassword ? <EyeOff /> : <Eye />}</button></span></label>
    {message && <p className={`admin-alert ${success ? 'success' : 'error'}`} role="status">{message}</p>}
    <button className="admin-primary" type="submit" disabled={!configured || loading}>{loading ? <LoaderCircle className="admin-spin" /> : <LogIn />}Entrar</button>
    <button className="admin-link-button" type="button" onClick={() => recoverPassword(true)} disabled={!configured || loading}>Primeiro acesso: criar senha</button>
    <button className="admin-link-button" type="button" onClick={() => recoverPassword(false)} disabled={!configured || loading}>Esqueci minha senha</button>
  </form>
}
