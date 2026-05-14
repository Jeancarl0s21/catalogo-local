# Status do Projeto: Catálogo Local

## 1. Nome do projeto

Catálogo Local

## 2. Objetivo do produto

Criar um SaaS simples para pequenos comércios locais montarem uma vitrine digital pública com produtos, categorias, preços, fotos ou placeholders visuais e botão de compra pelo WhatsApp.

O MVP busca atender lojistas que hoje usam o Instagram como catálogo improvisado e precisam de uma página mais organizada para compartilhar com clientes.

## 3. Stack atual

- Next.js
- TypeScript
- React
- Tailwind CSS
- ESLint
- Dados mockados locais

## 4. Rotas implementadas

- `/` - página inicial de apresentação do produto.
- `/loja/demo` - vitrine pública da loja demo.
- `/dashboard` - resumo mockado para o lojista.
- `/dashboard/produtos` - gerenciamento visual de produtos.
- `/dashboard/configuracoes` - configurações mockadas da loja.

## 5. Funcionalidades mockadas já prontas

- Vitrine pública com produtos mockados.
- Busca por nome na loja demo.
- Filtro por categoria na loja demo.
- Cards de produto com placeholder visual de imagem, nome, categoria, preço, descrição e botão de WhatsApp.
- Link do WhatsApp com mensagem automática usando o nome do produto clicado.
- Dashboard com indicadores de produtos ativos, inativos, categorias e destaques.
- Card com link público da loja demo.
- Botão visual de copiar link.
- Card de status da loja como catálogo online.
- Seção de últimos produtos cadastrados.
- Próximos passos para o lojista.
- Tela de produtos com busca por nome, categoria e status.
- Filtros rápidos de produtos: todos, ativos, inativos e destaques.
- Modal mockado para novo produto.
- Modal mockado para editar produto.
- Remoção com confirmação visual.
- Alternância visual entre produto ativo e inativo.
- Alterações temporárias em produtos usando estado local.
- Tela de configurações organizada em seções: dados da loja, link público, WhatsApp, mensagem automática e aparência da vitrine.

## 6. Arquivos principais

- `AGENTS.md` - regras e direcionamento do projeto.
- `README.md` - apresentação do projeto para o repositório.
- `PROJECT_STATUS.md` - documento de status atual do projeto.
- `package.json` - scripts e dependências.
- `.gitignore` - arquivos ignorados pelo Git.
- `app/layout.tsx` - layout raiz da aplicação.
- `app/page.tsx` - página inicial.
- `app/globals.css` - estilos globais e Tailwind.
- `app/lib/mock-data.ts` - dados mockados da loja e produtos.
- `app/loja/demo/page.tsx` - vitrine pública.
- `app/dashboard/layout.tsx` - layout do dashboard.
- `app/dashboard/page.tsx` - resumo do lojista.
- `app/dashboard/produtos/page.tsx` - gerenciamento mockado de produtos.
- `app/dashboard/configuracoes/page.tsx` - configurações mockadas da loja.

## 7. Decisões importantes tomadas

- O produto deve ser genérico para pequenos comércios locais.
- A loja de perfumes é apenas a demo inicial, não a regra do produto.
- O MVP atual deve usar dados mockados e não integrar Supabase ainda.
- Não há banco de dados, APIs ou login real nesta etapa.
- As interações do dashboard de produtos podem funcionar em estado local para fins de demonstração.
- A experiência deve ser mobile-first, limpa e apresentável para mostrar a lojistas.
- O botão de WhatsApp deve abrir uma mensagem pronta sobre o produto clicado.
- A mensagem padrão é: `Olá! Tenho interesse no produto: {{nome_do_produto}}. Ainda está disponível?`

## 8. O que ainda não foi implementado

- Autenticação real do lojista.
- Integração com Supabase.
- Banco de dados.
- APIs.
- Persistência real de produtos e configurações.
- Upload real de imagens.
- Salvar configurações de loja.
- Copiar link de forma funcional.
- Deploy em produção.
- Painel administrativo avançado.
- Pagamento online.
- Controle de estoque avançado.
- Marketplace.
- Múltiplos funcionários.
- Integração com Instagram.
- Relatórios avançados.

## 9. Próximos passos recomendados

1. Revisar visualmente o MVP em desktop e mobile.
2. Remover assets padrão não usados em `public/`, se aprovado.
3. Criar um commit inicial limpo para o GitHub.
4. Planejar o modelo de dados para loja e produtos.
5. Integrar Supabase em uma etapa futura.
6. Implementar login do lojista.
7. Persistir produtos e configurações da loja.
8. Implementar upload real de imagens.
9. Preparar deploy na Vercel.
10. Validar o MVP com lojistas reais antes de expandir funcionalidades.
