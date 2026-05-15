-- Catalogo Local - Supabase Storage policies
-- Bucket esperado: product-images, criado manualmente como publico.

drop policy if exists "Public can read product images" on storage.objects;
create policy "Public can read product images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'product-images');

drop policy if exists "Store owners can upload product images" on storage.objects;
create policy "Store owners can upload product images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'product-images'
  and exists (
    select 1
    from public.stores
    where stores.id::text = (storage.foldername(name))[1]
      and stores.owner_id = auth.uid()
  )
);

drop policy if exists "Store owners can update product images" on storage.objects;
create policy "Store owners can update product images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'product-images'
  and exists (
    select 1
    from public.stores
    where stores.id::text = (storage.foldername(name))[1]
      and stores.owner_id = auth.uid()
  )
)
with check (
  bucket_id = 'product-images'
  and exists (
    select 1
    from public.stores
    where stores.id::text = (storage.foldername(name))[1]
      and stores.owner_id = auth.uid()
  )
);

drop policy if exists "Store owners can delete product images" on storage.objects;
create policy "Store owners can delete product images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'product-images'
  and exists (
    select 1
    from public.stores
    where stores.id::text = (storage.foldername(name))[1]
      and stores.owner_id = auth.uid()
  )
);
