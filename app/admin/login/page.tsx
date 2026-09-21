import LoginForm from './LoginForm'
import { isSupabaseConfigured } from '@/lib/supabase/config'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const query = await searchParams
  return <main className="admin-auth-page">
    <section className="admin-auth-panel" aria-labelledby="login-title">
      <img src="/images/logo-wp-transparent.png" alt="WP Soluções Elétricas" className="admin-auth-logo" />
      <p className="admin-kicker">Área restrita</p>
      <h1 id="login-title">Painel do proprietário</h1>
      <p className="admin-muted">Entre com o e-mail previamente autorizado.</p>
      <LoginForm configured={isSupabaseConfigured} unauthorized={query.error === 'unauthorized'} />
    </section>
  </main>
}
