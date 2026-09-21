begin;

create extension if not exists pgcrypto;

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create policy "Administradores visualizam a própria autorização"
on public.admin_users for select
to authenticated
using (user_id = (select auth.uid()) and public.is_admin());

create table public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 100),
  description text not null check (char_length(description) between 2 and 300),
  category text not null default '' check (char_length(category) <= 80),
  image_path text,
  image_crop_index smallint check (image_crop_index between 0 and 3),
  image_alt text not null default '' check (char_length(image_alt) <= 180),
  display_order integer not null default 0 check (display_order >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index services_public_order_idx on public.services (is_active, display_order);
alter table public.services enable row level security;

create policy "Visitantes visualizam serviços ativos"
on public.services for select
to anon, authenticated
using (is_active or public.is_admin());

create policy "Administradores cadastram serviços"
on public.services for insert
to authenticated
with check (public.is_admin());

create policy "Administradores alteram serviços"
on public.services for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Administradores excluem serviços"
on public.services for delete
to authenticated
using (public.is_admin());

create table public.site_settings (
  id boolean primary key default true check (id),
  whatsapp_number text not null check (whatsapp_number ~ '^55[1-9]{2}[2-9][0-9]{7,8}$'),
  whatsapp_message text not null default '',
  phone text not null default '',
  email text not null default '',
  address text not null default '',
  business_hours text not null default '',
  instagram_url text not null default '',
  facebook_url text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

create policy "Visitantes visualizam configurações públicas"
on public.site_settings for select
to anon, authenticated
using (id = true);

create policy "Administradores alteram configurações"
on public.site_settings for update
to authenticated
using (id = true and public.is_admin())
with check (id = true and public.is_admin());

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger services_set_updated_at before update on public.services
for each row execute function public.set_updated_at();

create trigger site_settings_set_updated_at before update on public.site_settings
for each row execute function public.set_updated_at();

insert into public.services (title, description, category, image_alt, image_crop_index, display_order, is_active)
values
  ('Instalações Elétricas', 'Projetos e instalações residenciais, comerciais e industriais.', 'Instalações', 'Instalações elétricas', 0, 1, true),
  ('Automação Elétrica', 'Mais conforto, tecnologia e praticidade para o seu dia.', 'Automação', 'Automação elétrica', 1, 2, true),
  ('Iluminação Residencial e Comercial', 'Projetos que valorizam e economizam energia.', 'Iluminação', 'Iluminação residencial e comercial', 2, 3, true),
  ('Soluções Completas', 'Do planejamento à execução. Tudo em um só lugar.', 'Soluções completas', 'Soluções elétricas completas', 3, 4, true);

insert into public.site_settings (
  whatsapp_number,
  whatsapp_message,
  phone,
  instagram_url
) values (
  '5588998007589',
  'Olá, Wagner! Vi o site da WP Soluções Elétricas e gostaria de solicitar um orçamento.',
  '5588998007589',
  'https://www.instagram.com/wagner_wpsolucoeseletricas/'
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'service-images',
  'service-images',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Visitantes visualizam imagens de serviços ativos"
on storage.objects for select
to anon, authenticated
using (
  bucket_id = 'service-images'
  and exists (
    select 1 from public.services
    where image_path = name and (is_active or public.is_admin())
  )
);

create policy "Administradores enviam imagens de serviços"
on storage.objects for insert
to authenticated
with check (bucket_id = 'service-images' and public.is_admin());

create policy "Administradores substituem imagens de serviços"
on storage.objects for update
to authenticated
using (bucket_id = 'service-images' and public.is_admin())
with check (bucket_id = 'service-images' and public.is_admin());

create policy "Administradores excluem imagens de serviços"
on storage.objects for delete
to authenticated
using (bucket_id = 'service-images' and public.is_admin());

commit;
