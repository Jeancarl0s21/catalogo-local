-- Catalogo Local - Supabase schema
-- MVP: lojas, categorias e produtos com autenticacao de lojista.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  business_type text,
  logo_url text,
  banner_url text,
  primary_color text,
  whatsapp text,
  whatsapp_message_template text not null default 'Olá! Tenho interesse no produto: {{nome_do_produto}}. Ainda está disponível?',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint stores_owner_id_key unique (owner_id),
  constraint stores_slug_key unique (slug),
  constraint stores_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  name text not null,
  slug text not null,
  position integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_store_slug_key unique (store_id, slug),
  constraint categories_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null,
  description text,
  price numeric(10, 2),
  image_url text,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_store_slug_key unique (store_id, slug),
  constraint products_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint products_price_non_negative check (price is null or price >= 0)
);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists set_stores_updated_at on public.stores;
create trigger set_stores_updated_at
before update on public.stores
for each row
execute function public.set_updated_at();

drop trigger if exists set_categories_updated_at on public.categories;
create trigger set_categories_updated_at
before update on public.categories
for each row
execute function public.set_updated_at();

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.stores enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles
for select
to authenticated
using (id = auth.uid());

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles
for insert
to authenticated
with check (id = auth.uid());

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "Public can read active stores" on public.stores;
create policy "Public can read active stores"
on public.stores
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Owners can manage own stores" on public.stores;
create policy "Owners can manage own stores"
on public.stores
for all
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

drop policy if exists "Public can read active categories from active stores" on public.categories;
create policy "Public can read active categories from active stores"
on public.categories
for select
to anon, authenticated
using (
  is_active = true
  and exists (
    select 1
    from public.stores
    where stores.id = categories.store_id
      and stores.is_active = true
  )
);

drop policy if exists "Owners can manage categories from own stores" on public.categories;
create policy "Owners can manage categories from own stores"
on public.categories
for all
to authenticated
using (
  exists (
    select 1
    from public.stores
    where stores.id = categories.store_id
      and stores.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.stores
    where stores.id = categories.store_id
      and stores.owner_id = auth.uid()
  )
);

drop policy if exists "Public can read active products from active stores" on public.products;
create policy "Public can read active products from active stores"
on public.products
for select
to anon, authenticated
using (
  is_active = true
  and exists (
    select 1
    from public.stores
    where stores.id = products.store_id
      and stores.is_active = true
  )
);

drop policy if exists "Owners can manage products from own stores" on public.products;
create policy "Owners can manage products from own stores"
on public.products
for all
to authenticated
using (
  exists (
    select 1
    from public.stores
    where stores.id = products.store_id
      and stores.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.stores
    where stores.id = products.store_id
      and stores.owner_id = auth.uid()
  )
);
