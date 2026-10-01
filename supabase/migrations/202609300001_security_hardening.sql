begin;

drop policy if exists "Administradores enviam imagens de serviços" on storage.objects;
drop policy if exists "Administradores substituem imagens de serviços" on storage.objects;
drop policy if exists "Administradores excluem imagens de serviços" on storage.objects;

create policy "Administradores enviam imagens de serviços"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'service-images'
  and public.is_admin()
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "Administradores substituem imagens de serviços"
on storage.objects for update
to authenticated
using (
  bucket_id = 'service-images'
  and public.is_admin()
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'service-images'
  and public.is_admin()
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "Administradores excluem imagens de serviços"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'service-images'
  and public.is_admin()
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

alter table public.site_settings
  add constraint site_settings_email_length_check check (char_length(email) <= 254) not valid,
  add constraint site_settings_address_length_check check (char_length(address) <= 240) not valid,
  add constraint site_settings_business_hours_length_check check (char_length(business_hours) <= 180) not valid,
  add constraint site_settings_instagram_length_check check (char_length(instagram_url) <= 300) not valid,
  add constraint site_settings_facebook_length_check check (char_length(facebook_url) <= 300) not valid;

alter table public.site_settings validate constraint site_settings_email_length_check;
alter table public.site_settings validate constraint site_settings_address_length_check;
alter table public.site_settings validate constraint site_settings_business_hours_length_check;
alter table public.site_settings validate constraint site_settings_instagram_length_check;
alter table public.site_settings validate constraint site_settings_facebook_length_check;

commit;
