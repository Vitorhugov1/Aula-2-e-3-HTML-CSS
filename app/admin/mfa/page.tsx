import MfaForm from './MfaForm'

export const dynamic = 'force-dynamic'

export default function MfaPage() {
  return <main className="admin-auth-page">
    <section className="admin-auth-panel" aria-labelledby="mfa-title">
      <img src="/images/logo-wp-transparent.png" alt="WP Soluções Elétricas" className="admin-auth-logo" />
      <p className="admin-kicker">Segurança da conta</p>
      <h1 id="mfa-title">Verificação em duas etapas</h1>
      <p className="admin-muted">Use um aplicativo autenticador para proteger o acesso ao painel.</p>
      <MfaForm />
    </section>
  </main>
}
