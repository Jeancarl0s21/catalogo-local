import Link from "next/link";
import { categories, products, store } from "../lib/mock-data";

export default function DashboardPage() {
  const activeProducts = products.filter((product) => product.active).length;
  const inactiveProducts = products.length - activeProducts;
  const featuredProducts = products.filter((product) => product.highlight).length;
  const publicLink = `/loja/${store.slug}`;
  const latestProducts = products.slice(0, 4);

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <p className="text-sm font-semibold text-teal-700">Painel do lojista</p>
        <h1 className="text-3xl font-bold text-zinc-950">Resumo da loja</h1>
        <p className="max-w-2xl text-sm leading-6 text-zinc-600">
          Uma visão simples para acompanhar o catálogo, revisar produtos e compartilhar
          a loja demo com clientes.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-zinc-500">Produtos ativos</p>
          <strong className="mt-2 block text-3xl text-zinc-950">{activeProducts}</strong>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-zinc-500">Inativos</p>
          <strong className="mt-2 block text-3xl text-zinc-950">{inactiveProducts}</strong>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-zinc-500">Categorias</p>
          <strong className="mt-2 block text-3xl text-zinc-950">{categories.length - 1}</strong>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-zinc-500">Destaques</p>
          <strong className="mt-2 block text-3xl text-zinc-950">{featuredProducts}</strong>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-zinc-950">Link público da loja</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Compartilhe este endereço com clientes ou use na bio das redes sociais.
              </p>
            </div>
            <span className="w-fit rounded-lg bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              Catálogo online
            </span>
          </div>

          <div className="mt-4 rounded-lg border border-zinc-200 bg-stone-50 p-3">
            <p className="break-all text-sm font-bold text-zinc-950">{publicLink}</p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Link
              className="flex h-11 items-center justify-center rounded-lg bg-teal-800 px-4 text-sm font-bold text-white"
              href={publicLink}
            >
              Abrir loja
            </Link>
            <button
              className="h-11 rounded-lg border border-zinc-300 bg-white px-4 text-sm font-bold text-zinc-900"
              type="button"
            >
              Copiar link
            </button>
            <Link
              className="flex h-11 items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 text-sm font-bold text-zinc-900"
              href="/dashboard/produtos"
            >
              Adicionar produto
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-950">Status da loja</h2>
          <div className="mt-4 rounded-lg bg-emerald-50 p-4">
            <p className="text-sm font-bold text-emerald-800">Catálogo online</p>
            <p className="mt-1 text-sm leading-6 text-emerald-900">
              A vitrine demo está pronta para receber clientes pelo link público.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-zinc-950">Últimos produtos cadastrados</h2>
            <Link className="text-sm font-bold text-teal-800" href="/dashboard/produtos">
              Ver todos
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {latestProducts.map((product) => (
              <div
                className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3"
                key={product.id}
              >
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-lg ${product.imageClass}`}
                >
                  <div
                    className={`h-8 w-6 rounded-b-lg rounded-t-sm border ${product.bottleClass}`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-zinc-950">{product.name}</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {product.category} - {product.price}
                  </p>
                </div>
                <span
                  className={`rounded px-2 py-1 text-xs font-bold ${
                    product.active
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-zinc-100 text-zinc-600"
                  }`}
                >
                  {product.active ? "Ativo" : "Inativo"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-950">Próximos passos</h2>
          <div className="mt-4 space-y-3">
            <Link
              className="block rounded-lg border border-zinc-200 p-3 text-sm font-bold text-zinc-950"
              href="/dashboard/produtos"
            >
              Revisar produtos
              <span className="mt-1 block text-sm font-normal leading-6 text-zinc-600">
                Confira nomes, preços, destaques e produtos inativos.
              </span>
            </Link>
            <Link
              className="block rounded-lg border border-zinc-200 p-3 text-sm font-bold text-zinc-950"
              href="/dashboard/configuracoes"
            >
              Configurar WhatsApp
              <span className="mt-1 block text-sm font-normal leading-6 text-zinc-600">
                Garanta que os pedidos cheguem no número correto.
              </span>
            </Link>
            <div className="rounded-lg border border-zinc-200 p-3 text-sm font-bold text-zinc-950">
              Compartilhar link na bio do Instagram
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
