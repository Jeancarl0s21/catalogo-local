# Catálogo Local

Catálogo Local é um MVP de SaaS simples para pequenos comércios criarem uma vitrine digital pública com produtos, categorias, preços e botão de compra pelo WhatsApp.

A versão atual usa uma loja de perfumes apenas como demonstração inicial, mas o produto foi pensado para servir diferentes tipos de negócios locais, como lojas de roupa, variedades, presentes, cosméticos e outros comércios que vendem pelo WhatsApp.

## Objetivo do MVP

Validar a experiência principal de um lojista que precisa organizar seus produtos em uma página pública simples, mais fácil de compartilhar do que um perfil de Instagram usado como catálogo.

Fluxo principal:

1. O lojista configura dados básicos da loja.
2. O lojista cadastra e organiza produtos.
3. O cliente acessa a página pública da loja.
4. O cliente busca ou filtra produtos.
5. O cliente clica em comprar pelo WhatsApp.
6. O WhatsApp abre com uma mensagem pronta sobre o produto escolhido.

## Funcionalidades atuais

- Página inicial apresentando o produto.
- Página pública da loja demo em `/loja/demo`.
- Busca por nome na vitrine pública.
- Filtro por categoria na vitrine pública.
- Cards de produto com imagem visual mockada, categoria, preço e descrição.
- Botão de compra pelo WhatsApp com mensagem automática.
- Dashboard mockado do lojista.
- Tela de produtos com busca, filtros rápidos e ações visuais.
- Cadastro, edição, pausa/ativação e remoção temporária de produtos em estado local.
- Tela de configurações da loja organizada em seções.
- Configuração visual mockada de dados da loja, link público, WhatsApp, mensagem automática e aparência da vitrine.

## Tecnologias usadas

- Next.js
- TypeScript
- React
- Tailwind CSS
- ESLint

## Como rodar localmente

Instale as dependências:

```bash
npm install
```

Rode o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse no navegador:

```text
http://localhost:3000
```

Rode a verificação de lint:

```bash
npm run lint
```

## Rotas principais

- `/` - apresentação do produto.
- `/loja/demo` - vitrine pública da loja demo.
- `/dashboard` - resumo do lojista.
- `/dashboard/produtos` - gerenciamento visual de produtos.
- `/dashboard/configuracoes` - configurações mockadas da loja.

## Dados mockados

Esta versão ainda não usa banco de dados, Supabase, login real ou APIs.

Os produtos, dados da loja e configurações são mockados para validar a interface e o fluxo do MVP. Algumas ações do dashboard funcionam apenas em estado local durante a sessão, sem persistência permanente.

## Próximos passos planejados

- Integrar autenticação do lojista.
- Persistir dados da loja e produtos no Supabase.
- Salvar configurações reais de WhatsApp, slug e aparência.
- Permitir upload real de imagens de produtos.
- Preparar deploy na Vercel.
- Melhorar validações de formulário.
- Evoluir a vitrine para diferentes segmentos de pequenos comércios.
