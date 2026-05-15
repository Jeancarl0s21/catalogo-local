import Link from "next/link";
import { formatPrice, getDashboardData } from "./dashboard-data";
import { PublicLinkActions } from "./public-link-actions";

export const dynamic = "force-dynamic";

function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configuredUrl) {
    return configuredUrl.replace(/\/+$/g, "");
  }

  return "http://localhost:3000";
}

function getStoreInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return "CL";
  }

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

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
  const publicPath = store ? `/loja/${store.slug}` : "/loja/demo";
  const publicUrl = `${getSiteUrl()}${publicPath}`;
  const storeInitials = getStoreInitials(store?.name ?? "");

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <p className="text-sm font-semibold text-teal-700">Painel do lojista</p>
        <h1 className="text-3xl font-bold text-zinc-950">Resumo da loja</h1>
        <p className="max-w-2xl text-sm leading-6 text-zinc-600">
          Acompanhe o catalogo, revise produtos e compartilhe a vitrine com clientes.
        </p>
      </section>

      {!store ? (
        <section className="rounded-lg border border-amber-200 bg-amber-50 p-4 shadow-sm">
          <h2 className="text-lg font-bold text-amber-950">Nenhuma loja encontrada</h2>
          <p className="mt-2 text-sm leading-6 text-amber-900">
            Crie uma loja vinculada ao usuario logado para ver os dados neste painel.
          </p>
        </section>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Produtos cadastrados" value={productCount} />
        <MetricCard label="Produtos ativos" value={activeProductCount} />
        <MetricCard label="Produtos inativos" value={inactiveProducts} />
        <MetricCard label="Categorias ativas" value={activeCategoryCount} />
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="grid gap-5 lg:grid-cols-[120px_1fr] lg:items-start">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border border-zinc-200 bg-stone-100 text-2xl font-black text-teal-800">
            {store?.logo_url ? (
              <div
                aria-label={`Logo ${store.name}`}
                className="h-full w-full bg-cover bg-center"
                role="img"
                style={{ backgroundImage: `url(${store.logo_url})` }}
              />
            ) : (
              <span>{storeInitials}</span>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h2 className="break-words text-xl font-bold text-zinc-950">
                  {store?.name ?? "Loja ainda nao configurada"}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
                  {store?.description ?? "Adicione uma descricao curta para orientar clientes."}
                </p>
              </div>
              <span
                className={`w-fit shrink-0 rounded-lg px-3 py-1 text-xs font-bold ${
                  store?.is_active
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-zinc-100 text-zinc-600"
                }`}
              >
                {store?.is_active ? "Catalogo online" : "Catalogo inativo"}
              </span>
            </div>

            <div className="mt-5 grid gap-3 rounded-lg border border-zinc-200 bg-stone-50 p-3 sm:grid-cols-2">
              <SummaryItem label="Tipo de comercio" value={store?.business_type ?? "Nao informado"} />
              <SummaryItem label="WhatsApp" value={store?.whatsapp ?? "Nao informado"} />
              <div className="min-w-0 sm:col-span-2">
                <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                  Link publico
                </p>
                <a
                  className="mt-1 block truncate text-sm font-bold text-teal-800 underline-offset-2 transition hover:underline"
                  href={publicUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                  title={publicUrl}
                >
                  {publicUrl}
                </a>
              </div>
            </div>

            <div className="mt-4">
              <PublicLinkActions publicPath={publicPath} publicUrl={publicUrl} />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-zinc-950">Ultimos produtos cadastrados</h2>
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
                  className="grid grid-cols-[56px_1fr] gap-3 rounded-lg border border-zinc-200 p-3 sm:grid-cols-[56px_1fr_auto] sm:items-center"
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
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-zinc-950">{product.name}</p>
                    <p className="mt-1 truncate text-xs text-zinc-500">
                      {categoryById.get(product.category_id ?? "") ?? "Sem categoria"} -{" "}
                      {formatPrice(product.price)}
                    </p>
                  </div>
                  <span
                    className={`w-fit rounded px-2 py-1 text-xs font-bold sm:justify-self-end ${
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
          <h2 className="text-lg font-bold text-zinc-950">Proximos passos</h2>
          <div className="mt-4 space-y-3">
            <NextStep
              description="Confirme nome, WhatsApp, descricao, logo e status da loja."
              href="/dashboard/configuracoes"
              title="Revisar informacoes da loja"
            />
            <NextStep
              description="Atualize fotos, precos, categorias e status dos produtos."
              href="/dashboard/produtos"
              title="Manter produtos atualizados"
            />
            <NextStep
              description="Use o link publico na bio do Instagram e em conversas com clientes."
              href={publicPath}
              title="Compartilhar link da vitrine"
            />
            <NextStep
              description="Abra um produto na vitrine e confirme se a mensagem chega pronta."
              href={publicPath}
              title="Testar o botao de WhatsApp"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-zinc-500">{label}</p>
      <strong className="mt-2 block text-3xl text-zinc-950">{value}</strong>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-1 truncate text-sm font-bold text-zinc-950" title={value}>
        {value}
      </p>
    </div>
  );
}

function NextStep({
  description,
  href,
  title,
}: {
  description: string;
  href: string;
  title: string;
}) {
  return (
    <Link
      className="block cursor-pointer rounded-lg border border-zinc-200 p-3 text-sm font-bold text-zinc-950 transition hover:border-teal-700 hover:bg-teal-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200"
      href={href}
    >
      {title}
      <span className="mt-1 block text-sm font-normal leading-6 text-zinc-600">
        {description}
      </span>
    </Link>
  );
}
