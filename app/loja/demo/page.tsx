"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { categories, products, store, whatsappUrl } from "../../lib/mock-data";

export default function DemoStorePage() {
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
  }, [category, search]);

  return (
    <main className="min-h-screen bg-[#fbfaf7] pb-8 text-zinc-950">
      <section className="bg-teal-950 px-4 pb-10 pt-5 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-4">
            <Link className="text-sm font-semibold text-teal-50" href="/">
              Voltar
            </Link>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-teal-50">
              Catálogo demo
            </span>
          </div>

          <div className="mt-7 grid gap-7 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-teal-100">{store.segment}</p>
              <h1 className="max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
                {store.name}
              </h1>
              <p className="max-w-2xl text-base leading-7 text-teal-50">
                Perfumes selecionados para presentear, usar no dia a dia ou escolher uma
                assinatura marcante. Esta loja de perfumes é apenas a demo inicial do
                Catálogo Local.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 rounded-lg border border-white/10 bg-white/10 p-3">
              <div>
                <strong className="block text-2xl">{activeProducts.length}</strong>
                <span className="text-xs text-teal-50">Produtos cadastrados</span>
              </div>
              <div>
                <strong className="block text-2xl">{categories.length - 1}</strong>
                <span className="text-xs text-teal-50">Categorias</span>
              </div>
              <div>
                <strong className="block text-2xl">{featuredProducts}</strong>
                <span className="text-xs text-teal-50">Destaques</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-6 max-w-6xl px-4">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <label className="block text-sm font-bold text-zinc-800" htmlFor="search">
            Buscar perfume
          </label>
          <input
            className="mt-2 h-12 w-full rounded-lg border border-zinc-300 bg-white px-4 text-base text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-teal-800 focus:ring-2 focus:ring-teal-100"
            id="search"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Ex.: floral, oud, kit..."
            type="search"
            value={search}
          />

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
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
            className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm"
            key={product.id}
          >
            <div className={`relative flex h-52 items-center justify-center ${product.imageClass}`}>
              <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-teal-950 shadow-sm">
                {product.category}
              </div>
              {product.highlight ? (
                <div className="absolute right-4 top-4 rounded-full bg-zinc-950 px-3 py-1 text-xs font-bold text-white shadow-sm">
                  Destaque
                </div>
              ) : null}
              <div className="relative flex h-36 w-24 items-end justify-center">
                <div className="absolute top-0 h-5 w-8 rounded-t-md border border-white/60 bg-white/70" />
                <div
                  className={`h-28 w-20 rounded-b-2xl rounded-t-lg border-2 shadow-xl ${product.bottleClass}`}
                >
                  <div className="mx-auto mt-5 h-10 w-12 rounded-md bg-white/65" />
                  <div className="mx-auto mt-2 h-2 w-9 rounded bg-white/70" />
                </div>
              </div>
            </div>

            <div className="flex min-h-64 flex-col p-4">
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wide text-teal-800">
                  {product.category}
                </p>
                <h2 className="mt-1 text-lg font-bold leading-snug text-zinc-950">
                  {product.name}
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{product.description}</p>
              </div>

              <div className="mt-4">
                <p className="text-2xl font-bold text-zinc-950">{product.price}</p>
                <a
                  className="mt-3 flex h-11 items-center justify-center rounded-lg bg-emerald-700 px-4 text-sm font-bold text-white transition hover:bg-emerald-800"
                  href={whatsappUrl(product.name)}
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
    </main>
  );
}
