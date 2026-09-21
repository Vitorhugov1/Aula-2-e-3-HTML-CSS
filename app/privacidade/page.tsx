import type { Metadata } from 'next'
import Link from 'next/link'
import { formatBrazilianPhone, whatsappUrl } from '@/lib/contact-utils.mjs'
import { getPublicContent } from '@/lib/content'

export const metadata: Metadata = { title:'Aviso de Privacidade | WP Soluções Elétricas',description:'Saiba como a WP Soluções Elétricas trata dados pessoais e protege a sua privacidade.',alternates:{canonical:'/privacidade'} }

export const dynamic = 'force-dynamic'

export default async function PrivacyPage(){const {settings}=await getPublicContent();return <main className="legal-page"><article className="legal-content">
 <Link href="/" className="legal-back">← Voltar ao site</Link>
 <p className="eyebrow">INFORMAÇÕES LEGAIS</p><h1>Aviso de Privacidade</h1><p className="legal-date">Última atualização: 21 de setembro de 2026.</p>
 <p>A WP Soluções Elétricas respeita a sua privacidade. Este aviso explica, de forma objetiva, como dados pessoais podem ser tratados ao acessar este site ou iniciar contato pelos canais indicados.</p>
 <h2>1. Quem controla os dados</h2><p>A WP Soluções Elétricas é responsável pelas decisões relacionadas aos dados recebidos diretamente em seus canais de atendimento. Solicitações sobre privacidade podem ser feitas pelo WhatsApp <a href={whatsappUrl(settings.whatsapp_number)} target="_blank" rel="noopener noreferrer">{formatBrazilianPhone(settings.whatsapp_number)}</a>{settings.email&&<> ou pelo e-mail <a href={`mailto:${settings.email}`}>{settings.email}</a></>}.</p>
 <h2>2. Dados tratados</h2><p>A área pública não possui cadastro, formulário, analytics ou cookies de publicidade. Ao escolher falar pelo WhatsApp, Instagram ou outro canal indicado, você poderá fornecer voluntariamente nome, telefone, conteúdo da mensagem e informações necessárias para atendimento e orçamento.</p><p>A área administrativa privada utiliza e-mail, autenticação e cookies estritamente necessários para proteger a sessão do proprietário. A infraestrutura de hospedagem e autenticação pode registrar dados técnicos, como endereço IP, tipo de navegador, data, horário e páginas acessadas, para entrega, estabilidade e segurança do serviço.</p>
 <h2>3. Finalidades e bases legais</h2><p>Os dados são utilizados para responder solicitações, elaborar orçamentos, executar medidas pré-contratuais, prestar serviços, cumprir obrigações legais e proteger o site e seus usuários contra abusos.</p>
 <h2>4. Compartilhamento e links externos</h2><p>Dados poderão ser tratados por fornecedores essenciais de hospedagem, autenticação e comunicação, incluindo Vercel e Supabase dentro de suas respectivas funções, ou compartilhados quando exigido por lei. WhatsApp, Instagram e outros sites externos possuem políticas próprias, que passam a valer quando você deixa esta página.</p>
 <h2>5. Retenção e segurança</h2><p>As informações são mantidas somente pelo tempo necessário às finalidades informadas e às obrigações legais aplicáveis. São adotadas medidas técnicas e organizacionais razoáveis para reduzir riscos de acesso, alteração, divulgação ou perda indevida.</p>
 <h2>6. Seus direitos</h2><p>Nos termos da LGPD, você pode solicitar confirmação de tratamento, acesso, correção, informação sobre compartilhamentos e, quando aplicável, anonimização, bloqueio, eliminação, portabilidade, oposição ou revogação de consentimento. A solicitação poderá exigir validação de identidade para proteção do titular.</p>
 <h2>7. Atualizações</h2><p>Este aviso poderá ser atualizado para refletir mudanças legais, técnicas ou operacionais. A data da versão vigente será indicada no início desta página.</p>
 </article></main>}
