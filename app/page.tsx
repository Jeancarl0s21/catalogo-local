import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fbfaf7] px-4 py-5 text-zinc-950 sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-5xl flex-col gap-8 py-8 sm:py-14">
        <nav className="flex items-center justify-between">
          <span className="text-sm font-bold uppercase tracking-wide text-teal-800">
            Catálogo Local
          </span>
          <Link
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-800 shadow-sm"
            href="/dashboard"
          >
            Entrar no painel
          </Link>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-6">
            <p className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-sm font-bold text-teal-900">
              Catálogo digital com dados de demonstração
            </p>
            <h1 className="max-w-2xl text-4xl font-bold leading-tight text-zinc-950 sm:text-5xl">
              Transforme produtos soltos em um catálogo bonito para vender no WhatsApp.
            </h1>
            <p className="max-w-xl text-base leading-7 text-zinc-600 sm:text-lg">
              Uma primeira versão simples para pequenos comércios locais mostrarem
              produtos, categorias e preços em uma página pública fácil de compartilhar.
              A loja de perfumes é apenas a demonstração inicial.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                className="flex h-12 items-center justify-center rounded-lg bg-teal-800 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-teal-900"
                href="/loja/demo"
              >
                Ver loja demo
              </Link>
              <Link
                className="flex h-12 items-center justify-center rounded-lg border border-zinc-300 bg-white px-5 text-sm font-bold text-zinc-900 transition hover:bg-zinc-50"
                href="/dashboard/produtos"
              >
                Gerenciar produtos
              </Link>
            </div>

            <div className="grid gap-3 pt-1 sm:grid-cols-3">
              <div className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm">
                <strong className="block text-sm text-zinc-950">Página pública</strong>
                <span className="mt-1 block text-xs leading-5 text-zinc-600">
                  Catálogo acessível por slug.
                </span>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm">
                <strong className="block text-sm text-zinc-950">Busca e filtros</strong>
                <span className="mt-1 block text-xs leading-5 text-zinc-600">
                  O cliente encontra rápido.
                </span>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm">
                <strong className="block text-sm text-zinc-950">
                  Mensagem pronta no WhatsApp
                </strong>
                <span className="mt-1 block text-xs leading-5 text-zinc-600">
                  Pedido com produto preenchido.
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-teal-800">
                  Loja demo
                </p>
                <h2 className="mt-1 text-xl font-bold text-zinc-950">Aroma da Esquina</h2>
              </div>
              <span className="rounded-lg bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                Online
              </span>
            </div>

            <div className="space-y-3">
              <div className="rounded-lg border border-zinc-200 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-zinc-950">Perfume Floral 100ml</p>
                    <p className="mt-1 text-sm text-zinc-600">Perfumes</p>
                  </div>
                  <strong className="text-zinc-950">R$ 129,90</strong>
                </div>
                <div className="mt-3 h-10 rounded-lg bg-emerald-700 text-center text-sm font-bold leading-10 text-white">
                  Comprar pelo WhatsApp
                </div>
              </div>

              <div className="rounded-lg border border-zinc-200 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-zinc-950">Kit Presente Essencial</p>
                    <p className="mt-1 text-sm text-zinc-600">Kits</p>
                  </div>
                  <strong className="text-zinc-950">R$ 169,90</strong>
                </div>
                <div className="mt-3 h-10 rounded-lg bg-emerald-700 text-center text-sm font-bold leading-10 text-white">
                  Comprar pelo WhatsApp
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
