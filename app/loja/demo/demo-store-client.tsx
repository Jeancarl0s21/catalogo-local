"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type PublicStore = {
  name: string;
  segment: string;
  description: string;
  whatsapp: string;
  whatsappMessageTemplate: string;
  logoUrl?: string | null;
};

export type PublicProduct = {
  id: string | number;
  name: string;
  category: string;
  price: string;
  description: string;
  active: boolean;
  highlight?: boolean;
  imageUrl?: string | null;
  imageClass: string;
  bottleClass: string;
};

type DemoStoreClientProps = {
  store: PublicStore;
  categories: string[];
  products: PublicProduct[];
};

function whatsappUrl(store: PublicStore, productName: string) {
  const message = store.whatsappMessageTemplate.replace("{{nome_do_produto}}", productName);

  return `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(message)}`;
}

function getStoreInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function DemoStoreClient({ store, categories, products }: DemoStoreClientProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");

  const activeProducts = products.filter((product) => product.active);
  const featuredProducts = activeProducts.filter((product) => product.highlight).length;

  const visibleProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(normalizedSearch);
      const matchesCategory = category === "Todos" || product.category === category;

      return product.active && matchesSearch && matchesCategory;
    });
  }, [category, products, search]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fbfaf7] text-zinc-950">
      <section className="bg-teal-950 px-4 pb-12 pt-5 text-white sm:pb-14">
        <div className="mx-auto max-w-6xl">
          <div className="flex justify-end">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-teal-50">
              Catálogo online
            </span>
          </div>

          <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-start">
              {/* Future upload should recommend square 1:1 logos, accept PNG/JPG/WEBP, and validate size/proportion while preserving object-fit. */}
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-white text-xl font-black text-teal-950 shadow-sm sm:h-24 sm:w-24">
                {store.logoUrl ? (
                  <div
                    aria-label={`Logo ${store.name}`}
                    className="h-full w-full bg-contain bg-center bg-no-repeat"
                    role="img"
                    style={{ backgroundImage: `url(${store.logoUrl})` }}
                  />
                ) : (
                  <span>{getStoreInitials(store.name)}</span>
                )}
              </div>

              <div className="min-w-0 space-y-4">
                <p className="text-sm font-semibold text-teal-100">{store.segment}</p>
                <h1 className="max-w-2xl break-words text-3xl font-bold leading-tight sm:text-5xl">
                  {store.name}
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-teal-50 sm:text-base sm:leading-7">
                  {store.description}
                </p>
              </div>
            </div>

            <div className="grid min-w-0 grid-cols-3 gap-2 rounded-lg border border-white/10 bg-white/10 p-3 sm:gap-3">
              <div className="min-w-0">
                <strong className="block text-xl sm:text-2xl">{activeProducts.length}</strong>
                <span className="text-[11px] leading-4 text-teal-50 sm:text-xs">
                  Produtos cadastrados
                </span>
              </div>
              <div className="min-w-0">
                <strong className="block text-xl sm:text-2xl">
                  {Math.max(categories.length - 1, 0)}
                </strong>
                <span className="text-[11px] leading-4 text-teal-50 sm:text-xs">Categorias</span>
              </div>
              <div className="min-w-0">
                <strong className="block text-xl sm:text-2xl">{featuredProducts}</strong>
                <span className="text-[11px] leading-4 text-teal-50 sm:text-xs">Destaques</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-7 max-w-6xl px-4">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <label className="block text-sm font-bold text-zinc-800" htmlFor="search">
            Buscar produto
          </label>
          <input
            className="mt-2 h-12 w-full rounded-lg border border-zinc-300 bg-white px-4 text-base text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-teal-800 focus:ring-2 focus:ring-teal-100"
            id="search"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Ex.: camiseta, kit, presente..."
            type="search"
            value={search}
          />

          <div className="mt-4 flex max-w-full flex-wrap gap-2">
            {categories.map((item) => (
              <button
                className={`h-10 shrink-0 rounded-lg border px-4 text-sm font-semibold transition ${
                  item === category
                    ? "border-teal-800 bg-teal-800 text-white"
                    : "border-zinc-300 bg-white text-zinc-700"
                }`}
                key={item}
                onClick={() => setCategory(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-5 grid max-w-6xl gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleProducts.map((product) => (
          <article
            className="min-w-0 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm"
            key={product.id}
          >
            <div className={`relative flex h-52 items-center justify-center ${product.imageClass}`}>
              {product.imageUrl ? (
                <div
                  aria-label={product.name}
                  className="h-full w-full bg-cover bg-center"
                  role="img"
                  style={{ backgroundImage: `url(${product.imageUrl})` }}
                />
              ) : (
                <div className="relative flex h-36 w-24 items-end justify-center">
                  <div className="absolute top-0 h-5 w-8 rounded-t-md border border-white/60 bg-white/70" />
                  <div
                    className={`h-28 w-20 rounded-b-2xl rounded-t-lg border-2 shadow-xl ${product.bottleClass}`}
                  >
                    <div className="mx-auto mt-5 h-10 w-12 rounded-md bg-white/65" />
                    <div className="mx-auto mt-2 h-2 w-9 rounded bg-white/70" />
                  </div>
                </div>
              )}

              {product.category ? (
                <div className="absolute left-4 top-4 max-w-[calc(100%-2rem)] rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-teal-950 shadow-sm">
                  {product.category}
                </div>
              ) : null}

              {product.highlight ? (
                <div className="absolute right-4 top-4 rounded-full bg-zinc-950 px-3 py-1 text-xs font-bold text-white shadow-sm">
                  Destaque
                </div>
              ) : null}
            </div>

            <div className="flex min-h-64 flex-col p-4">
              <div className="min-w-0 flex-1">
                {product.category ? (
                  <p className="text-xs font-bold uppercase tracking-wide text-teal-800">
                    {product.category}
                  </p>
                ) : null}
                <h2 className="mt-1 break-words text-lg font-bold leading-snug text-zinc-950">
                  {product.name}
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{product.description}</p>
              </div>

              <div className="mt-4">
                <p className="text-2xl font-bold text-zinc-950">{product.price}</p>
                <a
                  className="mt-3 flex min-h-11 items-center justify-center rounded-lg bg-emerald-700 px-4 py-2 text-center text-sm font-bold text-white transition hover:bg-emerald-800"
                  href={whatsappUrl(store, product.name)}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Comprar pelo WhatsApp
                </a>
              </div>
            </div>
          </article>
        ))}

        {visibleProducts.length === 0 ? (
          <div className="rounded-lg border border-zinc-200 bg-white p-6 text-center sm:col-span-2 lg:col-span-3">
            <h2 className="font-bold text-zinc-950">Nenhum produto encontrado</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Tente buscar por outro nome ou escolher outra categoria.
            </p>
          </div>
        ) : null}
      </section>

      <footer className="mx-auto mt-8 max-w-6xl px-4 pb-8">
        <div className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white px-4 py-5 text-center shadow-sm sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <div>
            <p className="text-sm font-bold text-zinc-900">
              Catálogo criado com Catálogo Local
            </p>
            <p className="mt-1 text-sm text-zinc-600">
              Uma vitrine simples para vender pelo WhatsApp.
            </p>
          </div>
          <Link
            className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-300 px-4 text-sm font-bold text-zinc-800 transition hover:border-teal-700 hover:text-teal-800"
            href="/"
          >
            Criar meu catálogo
          </Link>
        </div>
      </footer>
    </main>
  );
}
