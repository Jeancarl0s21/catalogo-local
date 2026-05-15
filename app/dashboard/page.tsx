import Link from "next/link";
import { formatPrice, getDashboardData } from "./dashboard-data";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const {
    store,
    productCount,
    activeProductCount,
    activeCategoryCount,
    latestProducts,
    categoryById,
  } = await getDashboardData();
  const inactiveProducts = productCount - activeProductCount;
  const publicLink = store ? `/loja/${store.slug}` : "/loja/demo";

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <p className="text-sm font-semibold text-teal-700">Painel do lojista</p>
        <h1 className="text-3xl font-bold text-zinc-950">Resumo da loja</h1>
        <p className="max-w-2xl text-sm leading-6 text-zinc-600">
          Uma visão simples para acompanhar o catálogo, revisar produtos e compartilhar a
          loja com clientes.
        </p>
      </section>

      {!store ? (
        <section className="rounded-lg border border-amber-200 bg-amber-50 p-4 shadow-sm">
          <h2 className="text-lg font-bold text-amber-950">Nenhuma loja encontrada</h2>
          <p className="mt-2 text-sm leading-6 text-amber-900">
            Crie manualmente uma loja em `stores` com `owner_id` igual ao usuário logado
            para ver os dados reais neste painel.
          </p>
        </section>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-zinc-500">Produtos cadastrados</p>
          <strong className="mt-2 block text-3xl text-zinc-950">{productCount}</strong>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-zinc-500">Produtos ativos</p>
          <strong className="mt-2 block text-3xl text-zinc-950">{activeProductCount}</strong>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-zinc-500">Inativos</p>
          <strong className="mt-2 block text-3xl text-zinc-950">{inactiveProducts}</strong>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-zinc-500">Categorias ativas</p>
          <strong className="mt-2 block text-3xl text-zinc-950">{activeCategoryCount}</strong>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-zinc-950">
                {store?.name ?? "Loja ainda não configurada"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                {store?.description ??
                  "Os dados reais da loja aparecerão aqui depois que o registro for criado no Supabase."}
              </p>
            </div>
            <span
              className={`w-fit rounded-lg px-3 py-1 text-xs font-bold ${
                store?.is_active
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-zinc-100 text-zinc-600"
              }`}
            >
              {store?.is_active ? "Catálogo online" : "Catálogo inativo"}
            </span>
          </div>

          <div className="mt-4 grid gap-3 rounded-lg border border-zinc-200 bg-stone-50 p-3 sm:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                Link público
              </p>
              <p className="mt-1 break-all text-sm font-bold text-zinc-950">{publicLink}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                Tipo de comércio
              </p>
              <p className="mt-1 text-sm font-bold text-zinc-950">
                {store?.business_type ?? "Não informado"}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                WhatsApp
              </p>
              <p className="mt-1 text-sm font-bold text-zinc-950">
                {store?.whatsapp ?? "Não informado"}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                Cor principal
              </p>
              <p className="mt-1 text-sm font-bold text-zinc-950">
                {store?.primary_color ?? "Não informada"}
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Link
              className="flex h-11 cursor-pointer items-center justify-center rounded-lg bg-teal-800 px-4 text-sm font-bold text-white transition hover:bg-teal-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200"
              href={publicLink}
            >
              Abrir loja
            </Link>
            <button
              className="h-11 cursor-pointer rounded-lg border border-zinc-300 bg-white px-4 text-sm font-bold text-zinc-900 transition hover:border-teal-700 hover:text-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200"
              type="button"
            >
              Copiar link
            </button>
            <Link
              className="flex h-11 cursor-pointer items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 text-sm font-bold text-zinc-900 transition hover:border-teal-700 hover:text-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200"
              href="/dashboard/configuracoes"
            >
              Ver configurações
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-950">Identidade visual</h2>
          <div className="mt-4 grid gap-3">
            <InfoRow label="Logo" value={store?.logo_url ?? "Não informada"} />
            <InfoRow label="Banner" value={store?.banner_url ?? "Não informado"} />
            <InfoRow label="Slug" value={store?.slug ?? "Não configurado"} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-zinc-950">Últimos produtos cadastrados</h2>
            <Link
              className="cursor-pointer text-sm font-bold text-teal-800 transition hover:text-teal-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200"
              href="/dashboard/produtos"
            >
              Ver todos
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {latestProducts.length > 0 ? (
              latestProducts.map((product) => (
                <div
                  className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3"
                  key={product.id}
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-teal-50 text-xs font-black text-teal-900">
                    {product.image_url ? (
                      <div
                        aria-label={product.name}
                        className="h-full w-full bg-cover bg-center"
                        role="img"
                        style={{ backgroundImage: `url(${product.image_url})` }}
                      />
                    ) : (
                      product.name.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-zinc-950">{product.name}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {categoryById.get(product.category_id ?? "") ?? "Sem categoria"} -{" "}
                      {formatPrice(product.price)}
                    </p>
                  </div>
                  <span
                    className={`rounded px-2 py-1 text-xs font-bold ${
                      product.is_active
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {product.is_active ? "Ativo" : "Inativo"}
                  </span>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-zinc-300 p-4 text-sm leading-6 text-zinc-600">
                Nenhum produto cadastrado ainda.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-950">Próximos passos</h2>
          <div className="mt-4 space-y-3">
            <Link
              className="block cursor-pointer rounded-lg border border-zinc-200 p-3 text-sm font-bold text-zinc-950 transition hover:border-teal-700 hover:bg-teal-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200"
              href="/dashboard/configuracoes"
            >
              Revisar dados da loja
              <span className="mt-1 block text-sm font-normal leading-6 text-zinc-600">
                Confirme nome, WhatsApp, slug, descrição e identidade visual.
              </span>
            </Link>
            <Link
              className="block cursor-pointer rounded-lg border border-zinc-200 p-3 text-sm font-bold text-zinc-950 transition hover:border-teal-700 hover:bg-teal-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200"
              href="/dashboard/produtos"
            >
              Revisar produtos
              <span className="mt-1 block text-sm font-normal leading-6 text-zinc-600">
                O CRUD real de produtos será ligado em uma etapa futura.
              </span>
            </Link>
            <div className="rounded-lg border border-zinc-200 p-3 text-sm font-bold text-zinc-950">
              Compartilhar link da vitrine
              <span className="mt-1 block text-sm font-normal leading-6 text-zinc-600">
                Use o link público para transformar visitas em conversas no WhatsApp.
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-stone-50 p-3">
      <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-1 break-all text-sm font-bold text-zinc-950">{value}</p>
    </div>
  );
}
