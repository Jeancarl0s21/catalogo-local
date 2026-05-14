# Projeto: Catálogo Local

## Objetivo

Criar um SaaS simples para pequenos lojistas criarem um catálogo digital público com produtos, fotos, preços, categorias e botão de compra via WhatsApp.

## Produto inicial

O MVP deve atender lojas pequenas que hoje usam o Instagram como catálogo bagunçado.

O sistema deve ser genérico para pequenos comércios locais. A loja de perfume deve ser usada apenas como exemplo/demo inicial, não como regra de produto. Todas as telas, textos, dados mockados e decisões de interface devem continuar servindo bem para diferentes tipos de lojas locais.

## Público-alvo inicial

- lojas de perfume, apenas como exemplo/demo inicial
- lojas de roupa
- lojas de variedades
- lojas pequenas com venda pelo WhatsApp
- outros pequenos comércios locais que precisam de um catálogo simples

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- Supabase futuramente
- Vercel futuramente

## Funcionalidades do MVP

### Área pública

- página pública da loja
- listagem de produtos
- busca por nome
- filtro por categoria
- botão de WhatsApp em cada produto
- botão deve abrir uma mensagem pronta perguntando sobre o produto

### Área do lojista

- login futuramente
- dashboard simples
- cadastrar produto
- editar produto
- remover produto
- ativar/desativar produto
- configurar WhatsApp da loja
- configurar nome da loja
- configurar slug público da loja

## Fora do MVP agora

Não implementar nesta primeira etapa:

- pagamento online
- estoque avançado
- marketplace
- app mobile
- múltiplos funcionários
- assinatura automática
- painel administrativo complexo
- integração com Instagram
- relatórios avançados

## Regra principal

Primeiro criar a interface com dados mockados. Não integrar Supabase ainda.

## Fluxo principal

1. lojista configura dados da loja
2. lojista cadastra produtos
3. cliente acessa página pública da loja
4. cliente busca produto
5. cliente clica em comprar pelo WhatsApp
6. WhatsApp abre com uma mensagem pronta sobre aquele produto

## Mensagem padrão do WhatsApp

Olá! Tenho interesse no produto: {{nome_do_produto}}. Ainda está disponível?
