# Contexto Para Continuar: Upload De Imagens

## 1. Estado geral do projeto

- Projeto: Catalogo Local
- Stack: Next.js, TypeScript, Tailwind CSS, Supabase Auth, Supabase Database e Supabase Storage
- A pagina publica `/loja/demo` ja busca dados reais do Supabase com fallback mockado
- O dashboard ja esta protegido por login real com Supabase Auth
- O dashboard ja busca dados reais da loja do usuario logado
- A tela `/dashboard/produtos` ja implementa CRUD real de produtos no Supabase
- O campo `products.image_url` ja existe e e usado para exibir imagem do produto

## 2. Supabase ja configurado

- Tabelas criadas:
  - `profiles`
  - `stores`
  - `categories`
  - `products`
- RLS ativo nas tabelas
- Data API habilitada para essas tabelas
- Usuario de teste criado
- Loja demo criada
- Categorias e produtos criados
- Bucket Storage criado:
  - `product-images`
  - bucket publico

## 3. O que esta funcionando

- Login real funciona
- Rotas `/dashboard`, `/dashboard/produtos` e `/dashboard/configuracoes` estao protegidas
- CRUD real de produtos funciona sem imagem
- Criar produto funciona
- Editar produto funciona
- Pausar/ativar produto funciona
- Remover produto funciona
- Pagina publica exibe produtos reais do Supabase
- Botao de WhatsApp continua funcionando

## 4. Problema atual

O upload de imagem de produto ainda falha com erro de RLS do Supabase Storage.

Erro observado no console:

```text
Product image upload failed {
  bucket: 'product-images',
  message: 'new row violates row-level security policy',
  path: 'dd3d070a-c1d0-4c9d-81fb-cea3eafe5a13/1778813193338-malca.jpg'
}
```

O path atual comeca com `store_id`:

```text
{store_id}/{timestamp}-{nome-do-arquivo}
```

Exemplo:

```text
dd3d070a-c1d0-4c9d-81fb-cea3eafe5a13/1778813193338-malca.jpg
```

## 5. Diagnostico ja feito

- O path ja comeca com `store.id` corretamente.
- O codigo passou a validar sessao antes do upload.
- O codigo passou a validar auth user id.
- O codigo passou a validar `store.id`.
- O codigo passou a validar `store.owner_id`.
- O codigo passou a validar `store.owner_id === auth user id`.
- Mesmo assim, o Storage continua retornando erro de RLS.
- A causa provavel e a policy atual de Storage consultar `public.stores` dentro da policy de `storage.objects`, o que esta barrando o insert.

## 6. Solucao recomendada para a proxima etapa

Simplificar a estrategia do path e das policies.

Novo path recomendado:

```text
{auth_user_id}/{store_id}/{timestamp}-{nome-do-arquivo}
```

Exemplo:

```text
a8125b21-a6cf-4b8c-98bf-92708f5d1a7c/dd3d070a-c1d0-4c9d-81fb-cea3eafe5a13/1778813193338-malca.jpg
```

Nova policy recomendada:

- Nao consultar `public.stores` dentro das policies de Storage.
- Permitir leitura publica para bucket `product-images`.
- Permitir insert/update/delete apenas para `authenticated` quando:

```sql
bucket_id = 'product-images'
and auth.uid()::text = (storage.foldername(name))[1]
```

## 7. Arquivos relevantes

- `app/dashboard/produtos/products-manager.tsx`
- `app/dashboard/produtos/page.tsx`
- `app/lib/supabase.ts`
- `supabase/storage-policies.sql`
- `supabase/README.md`
- `AGENTS.md`
- `PROJECT_STATUS.md`

## 8. Proximo prompt recomendado no novo chat

```text
O upload de imagem continua falhando com erro:

new row violates row-level security policy

O path atual ja comeca com store_id:
dd3d070a-c1d0-4c9d-81fb-cea3eafe5a13/1778813193338-malca.jpg

Mas a policy atual do Storage depende de consultar public.stores dentro da policy de storage.objects, e isso esta bloqueando o upload.

Quero simplificar e tornar a policy mais robusta para o MVP.

Nova estrategia:

1. O caminho do arquivo no bucket product-images deve comecar com o ID do usuario autenticado, depois o ID da loja.

Novo formato obrigatorio:
{auth_user_id}/{store_id}/{timestamp}-{nome-do-arquivo}

Exemplo:
a8125b21-a6cf-4b8c-98bf-92708f5d1a7c/dd3d070a-c1d0-4c9d-81fb-cea3eafe5a13/1778813193338-malca.jpg

2. Atualizar app/dashboard/produtos/products-manager.tsx para usar esse novo path.

3. Antes do upload, validar:
- existe sessao
- existe auth user id
- existe store.id
- existe store.owner_id
- store.owner_id === auth user id

4. Atualizar supabase/storage-policies.sql para usar policies mais simples:

- leitura publica para bucket product-images
- insert permitido apenas para authenticated quando:
  bucket_id = 'product-images'
  and auth.uid()::text = (storage.foldername(name))[1]

- update permitido apenas para authenticated quando:
  bucket_id = 'product-images'
  and auth.uid()::text = (storage.foldername(name))[1]

- delete permitido apenas para authenticated quando:
  bucket_id = 'product-images'
  and auth.uid()::text = (storage.foldername(name))[1]

5. Nao consultar public.stores dentro das policies de Storage.

6. Nao usar service_role.
7. Nao expor chaves secretas.
8. Nao alterar schema das tabelas.
9. Nao mexer em login.
10. Nao mexer em signup.
11. Nao implementar upload de logo/banner.
12. Nao alterar a pagina publica, salvo se necessario para exibir image_url.

Depois rode:
npm run lint
npm run build

Ao final, informe:
1. path antigo
2. path novo
3. alteracoes feitas no storage-policies.sql
4. arquivos alterados
5. resultado do lint
6. resultado do build
```
