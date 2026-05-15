-- Catalogo Local - Supabase Storage policies
-- Bucket esperado: store-assets, criado manualmente como publico.

drop policy if exists "Public can read store assets" on storage.objects;
create policy "Public can read store assets"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'store-assets');

drop policy if exists "Store owners can upload store assets" on storage.objects;
create policy "Store owners can upload store assets"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'store-assets'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "Store owners can update store assets" on storage.objects;
create policy "Store owners can update store assets"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'store-assets'
  and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'store-assets'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "Store owners can delete store assets" on storage.objects;
create policy "Store owners can delete store assets"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'store-assets'
  and auth.uid()::text = (storage.foldername(name))[1]
);
