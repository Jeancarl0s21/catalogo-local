# Supabase

Este diretorio guarda o plano SQL inicial do banco do Catalogo Local.

Nesta etapa, o projeto ainda nao integra o app Next.js com Supabase. O arquivo `schema.sql` cria apenas a base necessaria para o MVP: lojista, loja, categorias e produtos.

## Como Rodar O SQL

1. Acesse o projeto no Supabase.
2. Abra **SQL Editor**.
3. Crie uma nova query.
4. Copie todo o conteudo de `supabase/schema.sql`.
5. Execute a query.
6. Confira em **Table Editor** se as tabelas foram criadas:
   - `profiles`
   - `stores`
   - `categories`
   - `products`
7. Confira em **Authentication > Policies** se o RLS esta ativo e se as policies foram criadas.

## Como Configurar Storage

Para upload real de imagens de produtos, crie manualmente um bucket publico no Supabase:

1. Acesse **Storage**.
2. Clique em **New bucket**.
3. Use o nome `product-images`.
4. Marque o bucket como **Public**.
5. Crie o bucket.
6. Abra **SQL Editor**.
7. Copie e execute o arquivo `supabase/storage-policies.sql`.

O app salva imagens no caminho:

```text
{auth_user_id}/{store_id}/{timestamp-ou-uuid}-{nome-do-arquivo}
```

Regras atuais do app:

- formatos aceitos: JPG, PNG e WEBP;
- tamanho maximo: 2 MB;
- recomendacao visual: imagem quadrada 1:1;
- a proporcao 1:1 ainda nao e obrigatoria;
- as policies do Storage validam o usuario autenticado pelo primeiro segmento do caminho;
- upload de logo e banner ainda nao foi implementado.

## O Que Cada Tabela Faz

### `profiles`

Guarda dados complementares do lojista autenticado.

O usuario real fica em `auth.users`, gerenciado pelo Supabase Auth. O campo `profiles.id` usa o mesmo ID do usuario autenticado.

### `stores`

Guarda os dados publicos e configuraveis da loja:

- nome da loja
- slug publico
- tipo de negocio em `business_type`
- URL do logo em `logo_url`
- URL do banner em `banner_url`
- cor principal em `primary_color`
- WhatsApp
- mensagem padrao do WhatsApp
- descricao
- status ativo/inativo

O campo `owner_id` vincula a loja ao usuario em `auth.users`.

No MVP, existe uma constraint `unique(owner_id)` em `stores`. Isso significa que cada usuario pode ter apenas uma loja.

### `categories`

Guarda as categorias de produtos de uma loja.

O slug da categoria e unico apenas dentro da mesma loja, entao duas lojas diferentes podem ter uma categoria com slug `promocoes`.

### `products`

Guarda os produtos cadastrados pelo lojista.

Cada produto pertence a uma loja e pode pertencer a uma categoria. O slug do produto e unico apenas dentro da mesma loja.

## Seguranca E RLS

Todas as tabelas tem RLS ativado.

As regras basicas sao:

- o usuario autenticado le e atualiza apenas o proprio profile;
- qualquer pessoa le apenas lojas ativas;
- o dono gerencia apenas sua propria loja;
- qualquer pessoa le apenas categorias ativas de lojas ativas;
- o dono gerencia apenas categorias da propria loja;
- qualquer pessoa le apenas produtos ativos de lojas ativas;
- o dono gerencia apenas produtos da propria loja.

## Dados Para Inserir Manualmente Em Teste

Para testar no Supabase antes da integracao com o Next.js, ainda sera preciso criar manualmente:

1. Um usuario em **Authentication > Users**.
2. Um registro em `profiles` usando o mesmo `id` do usuario.
3. Uma loja em `stores` usando `owner_id` igual ao `id` do usuario.
4. Algumas categorias em `categories` usando o `store_id` da loja.
5. Alguns produtos em `products` usando o `store_id` da loja e, opcionalmente, o `category_id`.

Nao foram criadas tabelas de pedidos, assinaturas, estoque ou storage/upload nesta etapa.
