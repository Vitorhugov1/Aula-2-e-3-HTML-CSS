import ResetPasswordForm from './ResetPasswordForm'

export default function ResetPasswordPage() {
  return <main className="admin-auth-page"><section className="admin-auth-panel" aria-labelledby="reset-title">
    <p className="admin-kicker">Conta</p><h1 id="reset-title">Criar nova senha</h1>
    <p className="admin-muted">Use no mínimo oito caracteres.</p><ResetPasswordForm />
  </section></main>
}
