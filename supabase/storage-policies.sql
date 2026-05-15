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
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "Store owners can update product images" on storage.objects;
create policy "Store owners can update product images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'product-images'
  and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'product-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "Store owners can delete product images" on storage.objects;
create policy "Store owners can delete product images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'product-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);
