# Configuração técnica do Supabase e da Vercel

## 1. Criar o projeto Supabase

Crie o projeto na conta que ficará sob controle do proprietário. Guarde a senha do banco em um gerenciador de senhas. Em **Project Settings > API**, copie:

- Project URL;
- chave pública `anon` (ou publishable key equivalente).

A aplicação não usa e não precisa de `service_role` em produção. Nunca cadastre essa chave na Vercel nem no GitHub.

## 2. Executar a migration

Abra **SQL Editor** no Supabase, cole o conteúdo de `supabase/migrations/202609210001_admin_content.sql` e execute uma vez. A migration cria:

- `admin_users`, que autoriza os proprietários;
- `services`, com conteúdo, ordem e visibilidade;
- `site_settings`, limitado a um único registro;
- função `is_admin()` e gatilhos de `updated_at`;
- bucket privado `service-images`, com limite de 5 MB e MIME types permitidos;
- políticas RLS de leitura pública restrita e escrita exclusiva de administradores.

Também são inseridos os quatro serviços e contatos atuais, evitando interrupção dos botões.

## 3. Migrar as imagens atuais

Esta etapa é executada uma única vez em uma máquina confiável, não na Vercel.

1. Copie `.env.seed.example` para `.env.seed`.
2. Preencha a URL e, temporariamente, a `service_role` do Supabase.
3. Execute `pnpm seed:supabase`.
4. Apague `.env.seed` e remova qualquer cópia local da chave.

O script envia quatro cópias da imagem composta atual para o bucket privado e mantém o mesmo recorte visual de cada cartão. Quando uma imagem for substituída no painel, ela passa a ser exibida normalmente, sem recorte legado.

## 4. Criar e autorizar o primeiro administrador

Em **Authentication > Providers > Email**, mantenha login por e-mail ativo e desative cadastro público. Configure uma senha mínima forte. Em **Authentication > Users**, crie ou convide o e-mail do proprietário.

Depois de o usuário existir, execute no SQL Editor, substituindo somente o e-mail:

```sql
insert into public.admin_users (user_id)
select id from auth.users where email = 'EMAIL_DO_PROPRIETARIO'
on conflict (user_id) do nothing;
```

Não crie uma política de `insert` para `admin_users`. Isso impediria que um usuário comum promovesse a própria conta.

Para remover um administrador no futuro:

```sql
delete from public.admin_users
where user_id = (select id from auth.users where email = 'EMAIL_A_REMOVER');
```

## 5. Recuperação de senha

Em **Authentication > URL Configuration** configure:

- Site URL: `https://wp-solucoes-eletricas.vercel.app`;
- Redirect URL: `https://wp-solucoes-eletricas.vercel.app/admin/auth/callback`;
- para previews necessários, adicione apenas URLs confiáveis e específicas.

Configure SMTP próprio para entrega confiável em produção. O fluxo usa PKCE, troca o código no servidor e leva o usuário para `/admin/reset-password`.

## 6. Variáveis na Vercel

Em **Project Settings > Environment Variables**, adicione para Production, Preview e Development:

```text
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_PUBLICA
NEXT_PUBLIC_SITE_URL=https://wp-solucoes-eletricas.vercel.app
```

Essas duas credenciais Supabase são públicas por definição; a proteção real é feita por autenticação e RLS. Não adicione `SUPABASE_SERVICE_ROLE_KEY` à Vercel. Depois de salvar, faça um novo deploy.

## 7. Testar as políticas RLS

Faça os testes em uma janela anônima, com uma conta autenticada sem registro em `admin_users` e com a conta administrativa:

- visitante lê apenas serviços ativos e o registro público de configurações;
- visitante não insere, altera nem exclui tabelas ou arquivos;
- conta comum não acessa o painel e não modifica conteúdo;
- administrador executa CRUD e upload;
- imagem inválida ou maior que 5 MB é rejeitada na aplicação e pelo bucket;
- ao desativar um serviço, ele some da home e sua imagem deixa de ser legível anonimamente;
- `/admin` redireciona usuários sem sessão e não aparece em `sitemap.xml`;
- `/admin` e `/admin/login` retornam `noindex, nofollow`.

Também teste login correto, senha incorreta, recuperação, inclusão, edição, exclusão, ordem, campos opcionais vazios, WhatsApp e responsividade.

## 8. Transferir o projeto ao proprietário

Antes de encerrar o trabalho, confirme que o proprietário controla:

1. repositório do GitHub e organização, com autenticação em dois fatores;
2. projeto e equipe da Vercel, incluindo variáveis de ambiente;
3. organização e projeto do Supabase, cobrança e e-mail de recuperação;
4. registrador e DNS do domínio;
5. e-mail administrativo e SMTP.

Depois da confirmação, remova o desenvolvedor do GitHub, Vercel, Supabase e registrador. Revogue convites pendentes, tokens pessoais e chaves antigas. A remoção não afeta o site porque a aplicação usa somente a chave pública e as sessões do proprietário.

## 9. Operação e segurança contínuas

- Mantenha Next.js e Supabase atualizados.
- Revise administradores e logs de autenticação periodicamente.
- Ative MFA para contas de infraestrutura.
- Faça exportações periódicas do banco e mantenha o repositório protegido.
- Se forem adicionados analytics, pixels ou cookies publicitários, implemente consentimento e atualize o Aviso de Privacidade.
