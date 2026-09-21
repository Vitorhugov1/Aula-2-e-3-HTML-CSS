'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowDown, ArrowUp, ExternalLink, Facebook, ImagePlus, Instagram, LoaderCircle, LogOut, Mail, MapPin, MessageCircle, Pencil, Phone, Plus, Save, Trash2, X } from 'lucide-react'
import { deleteServiceAction, moveServiceAction, saveServiceAction, saveSettingsAction, signOutAction } from './actions'
import { formatBrazilianPhone, normalizeBrazilianWhatsApp, whatsappUrl } from '@/lib/contact-utils.mjs'
import type { ActionResult, Service, SiteSettings } from '@/lib/types'

type DashboardProps = { services: Service[]; settings: SiteSettings; userEmail: string }

function Feedback({ result }: { result: ActionResult | null }) {
  return result ? <p className={`admin-alert ${result.ok ? 'success' : 'error'}`} role="status">{result.message}</p> : null
}

function LegacyImage({ index = 0, alt, src = '/images/services-hd.webp' }: { index?: number; alt: string; src?: string }) {
  return <span className="admin-legacy-image"><img src={src} alt={alt} style={{ left: index % 2 ? '-100%' : 0, top: index > 1 ? '-100%' : 0 }} /></span>
}

function ServiceImage({ service }: { service: Service }) {
  return service.image_url && service.image_crop_index == null
    ? <img className="admin-service-image" src={service.image_url} alt={service.image_alt || service.title} />
    : <LegacyImage index={service.image_crop_index ?? service.legacy_image_index} alt={service.image_alt || service.title} src={service.image_url ?? undefined} />
}

function ServiceEditor({ service, onDone }: { service?: Service; onDone: (result?: ActionResult) => void }) {
  const [preview, setPreview] = useState(service?.image_url ?? '')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ActionResult | null>(null)

  useEffect(() => () => { if (preview.startsWith('blob:')) URL.revokeObjectURL(preview) }, [preview])

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setResult(null)
    const response = await saveServiceAction(new FormData(event.currentTarget))
    setLoading(false)
    setResult(response)
    if (response.ok) onDone(response)
  }

  function chooseImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    if (preview.startsWith('blob:')) URL.revokeObjectURL(preview)
    setPreview(URL.createObjectURL(file))
  }

  return <form className="admin-editor" onSubmit={submit}>
    <input type="hidden" name="id" value={service?.id ?? ''} />
    <div className="admin-image-picker">
      {preview ? <img src={preview} alt="Prévia da imagem escolhida" /> : service ? <ServiceImage service={service} /> : <span><ImagePlus /><b>Nenhuma imagem</b></span>}
      <label className="admin-secondary"><ImagePlus />Escolher imagem<input type="file" name="image" accept="image/jpeg,image/png,image/webp" onChange={chooseImage} /></label>
      <small>JPG, JPEG, PNG ou WebP. Máximo de 5 MB.</small>
    </div>
    <div className="admin-fields">
      <label>Título<input name="title" defaultValue={service?.title} maxLength={100} required /></label>
      <label>Descrição<textarea name="description" defaultValue={service?.description} maxLength={300} rows={3} required /></label>
      <div className="admin-field-row"><label>Categoria<input name="category" defaultValue={service?.category} maxLength={80} /></label><label>Texto alternativo da imagem<input name="image_alt" defaultValue={service?.image_alt} maxLength={180} placeholder="Descreva o que aparece na imagem" /></label></div>
      <label className="admin-toggle"><input type="checkbox" name="is_active" defaultChecked={service?.is_active ?? true} /><span />Exibir este serviço no site</label>
      <Feedback result={result} />
      <div className="admin-form-actions"><button className="admin-primary" disabled={loading}>{loading ? <LoaderCircle className="admin-spin" /> : <Save />}Salvar</button><button type="button" className="admin-secondary" onClick={() => onDone()} disabled={loading}><X />Cancelar</button></div>
    </div>
  </form>
}

function ServicesPanel({ initialServices, notify }: { initialServices: Service[]; notify: (result: ActionResult) => void }) {
  const router = useRouter()
  const [editing, setEditing] = useState<string | 'new' | null>(null)
  const [busy, setBusy] = useState<string | null>(null)

  function refresh(result?: ActionResult) {
    setEditing(null)
    if (result) notify(result)
    router.refresh()
  }

  async function move(id: string, direction: 'up' | 'down') {
    setBusy(id)
    const result = await moveServiceAction(id, direction)
    setBusy(null)
    notify(result)
    if (result.ok) router.refresh()
  }

  async function remove(service: Service) {
    if (!window.confirm(`Excluir “${service.title}”? A imagem vinculada também será removida.`)) return
    setBusy(service.id)
    const result = await deleteServiceAction(service.id)
    setBusy(null)
    notify(result)
    if (result.ok) router.refresh()
  }

  return <section className="admin-section" id="servicos-admin">
    <div className="admin-section-heading"><div><p className="admin-kicker">Conteúdo público</p><h2>Serviços e imagens</h2><p className="admin-muted">Altere os cartões exibidos na landing page.</p></div><button className="admin-primary" onClick={() => setEditing('new')}><Plus />Adicionar serviço</button></div>
    {editing === 'new' && <ServiceEditor onDone={refresh} />}
    <div className="admin-service-list">
      {initialServices.map((service, index) => <article className="admin-service-item" key={service.id}>
        <ServiceImage service={service} />
        <div className="admin-service-copy"><div className="admin-service-title"><h3>{service.title}</h3><span className={service.is_active ? 'active' : 'inactive'}>{service.is_active ? 'Visível' : 'Oculto'}</span></div><p>{service.description}</p><small>{service.category || 'Sem categoria'}</small></div>
        <div className="admin-icon-actions" aria-label={`Ações de ${service.title}`}>
          <button onClick={() => move(service.id, 'up')} disabled={index === 0 || busy === service.id} title="Mover para cima" aria-label="Mover para cima"><ArrowUp /></button>
          <button onClick={() => move(service.id, 'down')} disabled={index === initialServices.length - 1 || busy === service.id} title="Mover para baixo" aria-label="Mover para baixo"><ArrowDown /></button>
          <button onClick={() => setEditing(editing === service.id ? null : service.id)} disabled={busy === service.id} title="Editar" aria-label="Editar"><Pencil /></button>
          <button className="danger" onClick={() => remove(service)} disabled={busy === service.id} title="Excluir" aria-label="Excluir">{busy === service.id ? <LoaderCircle className="admin-spin" /> : <Trash2 />}</button>
        </div>
        {editing === service.id && <div className="admin-editor-wrap"><ServiceEditor service={service} onDone={refresh} /></div>}
      </article>)}
    </div>
  </section>
}

function ContactPanel({ settings, notify }: { settings: SiteSettings; notify: (result: ActionResult) => void }) {
  const router = useRouter()
  const [whatsapp, setWhatsapp] = useState(formatBrazilianPhone(settings.whatsapp_number))
  const [message, setMessage] = useState(settings.whatsapp_message)
  const [loading, setLoading] = useState(false)

  function maskPhone(input: string) {
    const digits = input.replace(/\D/g, '').replace(/^55(?=\d{10,11}$)/, '').slice(0, 11)
    if (digits.length <= 2) return digits
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    const result = await saveSettingsAction(new FormData(event.currentTarget))
    setLoading(false)
    notify(result)
    if (result.ok) router.refresh()
  }

  const normalized = normalizeBrazilianWhatsApp(whatsapp)
  return <section className="admin-section" id="contato-admin">
    <div className="admin-section-heading"><div><p className="admin-kicker">Dados centralizados</p><h2>Informações de contato</h2><p className="admin-muted">Uma alteração atualiza todos os pontos correspondentes do site.</p></div></div>
    <form className="admin-contact-form" onSubmit={submit}>
      <div className="admin-field-row"><label><span><MessageCircle />WhatsApp</span><input name="whatsapp_number" value={whatsapp} onChange={(event) => setWhatsapp(maskPhone(event.target.value))} inputMode="tel" required /></label><label><span><Phone />Telefone comercial</span><input name="phone" defaultValue={formatBrazilianPhone(settings.phone)} onChange={(event) => { event.currentTarget.value = maskPhone(event.currentTarget.value) }} inputMode="tel" /></label></div>
      <label><span><MessageCircle />Mensagem padrão do WhatsApp</span><textarea name="whatsapp_message" value={message} onChange={(event) => setMessage(event.target.value)} maxLength={500} rows={3} /></label>
      <a className={`admin-secondary admin-test-link ${normalized ? '' : 'disabled'}`} href={normalized ? whatsappUrl(normalized, message) : undefined} target="_blank" rel="noopener noreferrer" aria-disabled={!normalized}><ExternalLink />Testar WhatsApp</a>
      <div className="admin-field-row"><label><span><Mail />E-mail comercial</span><input name="email" type="email" defaultValue={settings.email} /></label><label><span><MapPin />Endereço</span><input name="address" defaultValue={settings.address} maxLength={240} /></label></div>
      <label>Horário de atendimento<input name="business_hours" defaultValue={settings.business_hours} maxLength={180} placeholder="Ex.: Segunda a sexta, das 8h às 18h" /></label>
      <div className="admin-field-row"><label><span><Instagram />Instagram</span><input name="instagram_url" type="url" defaultValue={settings.instagram_url} placeholder="https://instagram.com/..." /></label><label><span><Facebook />Facebook</span><input name="facebook_url" type="url" defaultValue={settings.facebook_url} placeholder="https://facebook.com/..." /></label></div>
      <button className="admin-primary" disabled={loading}>{loading ? <LoaderCircle className="admin-spin" /> : <Save />}Salvar informações</button>
    </form>
  </section>
}

export default function AdminDashboard({ services, settings, userEmail }: DashboardProps) {
  const [feedback, setFeedback] = useState<ActionResult | null>(null)
  useEffect(() => {
    if (!feedback) return
    const timer = window.setTimeout(() => setFeedback(null), 5000)
    return () => window.clearTimeout(timer)
  }, [feedback])

  return <main className="admin-dashboard">
    <header className="admin-header"><div><img src="/images/logo-wp-transparent.png" alt="WP Soluções Elétricas" /><div><p>Painel administrativo</p><span>{userEmail}</span></div></div><form action={signOutAction}><button className="admin-secondary"><LogOut />Sair</button></form></header>
    <nav className="admin-tabs" aria-label="Seções do painel"><a href="#servicos-admin">Serviços e imagens</a><a href="#contato-admin">Informações de contato</a><a href="#conta-admin">Conta e saída</a></nav>
    {feedback && <div className="admin-global-feedback"><Feedback result={feedback} /></div>}
    <ServicesPanel initialServices={services} notify={setFeedback} />
    <ContactPanel settings={settings} notify={setFeedback} />
    <section className="admin-section admin-account" id="conta-admin"><div><p className="admin-kicker">Acesso</p><h2>Conta e saída</h2><p className="admin-muted">Administrador conectado: {userEmail}</p></div><form action={signOutAction}><button className="admin-secondary"><LogOut />Sair do painel</button></form></section>
  </main>
}
