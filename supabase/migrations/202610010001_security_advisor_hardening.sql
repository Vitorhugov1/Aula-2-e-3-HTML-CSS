begin;

create schema if not exists private;

revoke all on schema private from public;
grant usage on schema private to anon, authenticated;

alter function public.is_admin() set schema private;

revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to anon, authenticated;

commit;
