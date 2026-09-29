import RecoveryHandler from './RecoveryHandler'

export default function RecoveryPage() {
  return <main className="admin-auth-page">
    <section className="admin-auth-panel" aria-labelledby="recovery-title">
      <img src="/images/logo-wp-transparent.png" alt="WP Soluções Elétricas" className="admin-auth-logo" />
      <p className="admin-kicker">Conta</p>
      <h1 id="recovery-title">Confirmando acesso</h1>
      <RecoveryHandler />
    </section>
  </main>
}
