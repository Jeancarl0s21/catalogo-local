"use client";

import { FormEvent, useMemo, useState } from "react";
import { type Product, products as mockProducts } from "../../lib/mock-data";

const filters = ["Todos", "Ativos", "Inativos", "Destaques"] as const;

const imageOptions = [
  {
    key: "floral",
    label: "Frasco floral",
    imageClass: "bg-[linear-gradient(135deg,#fff1f2,#fbcfe8,#fef3c7)]",
    bottleClass: "bg-rose-200 border-rose-300",
  },
  {
    key: "dark",
    label: "Frasco premium escuro",
    imageClass: "bg-[linear-gradient(135deg,#e7e5e4,#78716c,#1c1917)]",
    bottleClass: "bg-stone-700 border-stone-500",
  },
  {
    key: "fresh",
    label: "Frasco fresco",
    imageClass: "bg-[linear-gradient(135deg,#ecfccb,#bbf7d0,#bae6fd)]",
    bottleClass: "bg-lime-200 border-lime-300",
  },
  {
    key: "gift",
    label: "Frasco presente",
    imageClass: "bg-[linear-gradient(135deg,#ccfbf1,#f0fdfa,#d9f99d)]",
    bottleClass: "bg-teal-200 border-teal-300",
  },
];

type Filter = (typeof filters)[number];
type ImageOption = (typeof imageOptions)[number];

type ProductForm = {
  name: string;
  category: string;
  price: string;
  description: string;
  highlight: boolean;
  active: boolean;
  imageKey: string;
};

const emptyForm: ProductForm = {
  name: "",
  category: "",
  price: "",
  description: "",
  highlight: false,
  active: true,
  imageKey: imageOptions[0].key,
};

function getImageOption(key: string): ImageOption {
  return imageOptions.find((option) => option.key === key) ?? imageOptions[0];
}

function getProductImageKey(product: Product) {
  return (
    imageOptions.find(
      (option) =>
        option.imageClass === product.imageClass && option.bottleClass === product.bottleClass,
    )?.key ?? imageOptions[0].key
  );
}

function productToForm(product: Product): ProductForm {
  return {
    name: product.name,
    category: product.category,
    price: product.price,
    description: product.description,
    highlight: Boolean(product.highlight),
    active: product.active,
    imageKey: getProductImageKey(product),
  };
}

export default function DashboardProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("Todos");
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToRemove, setProductToRemove] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return products.filter((product) => {
      const status = product.active ? "ativo" : "inativo";
      const matchesSearch =
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.category.toLowerCase().includes(normalizedSearch) ||
        status.includes(normalizedSearch);

      const matchesFilter =
        filter === "Todos" ||
        (filter === "Ativos" && product.active) ||
        (filter === "Inativos" && !product.active) ||
        (filter === "Destaques" && product.highlight);

      return matchesSearch && matchesFilter;
    });
  }, [filter, products, search]);

  function openNewProductModal() {
    setEditingProduct(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  }

  function openEditProductModal(product: Product) {
    setEditingProduct(product);
    setForm(productToForm(product));
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingProduct(null);
    setForm(emptyForm);
  }

  function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const imageOption = getImageOption(form.imageKey);
    const productData = {
      name: form.name.trim(),
      category: form.category.trim(),
      price: form.price.trim(),
      description: form.description.trim(),
      active: form.active,
      highlight: form.highlight,
      imageClass: imageOption.imageClass,
      bottleClass: imageOption.bottleClass,
    };

    if (editingProduct) {
      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === editingProduct.id ? { ...product, ...productData } : product,
        ),
      );
    } else {
      setProducts((currentProducts) => [
        {
          id: Date.now(),
          ...productData,
        },
        ...currentProducts,
      ]);
    }

    closeModal();
  }

  function toggleProductStatus(productId: number) {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === productId ? { ...product, active: !product.active } : product,
      ),
    );
  }

  function removeProduct() {
    if (!productToRemove) {
      return;
    }

    setProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== productToRemove.id),
    );
    setProductToRemove(null);
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-teal-700">Catálogo</p>
          <h1 className="text-3xl font-bold text-zinc-950">Produtos</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
            As mudanças feitas aqui são temporárias e servem apenas para a demonstração.
          </p>
        </div>
        <button
          className="h-11 rounded-lg bg-teal-800 px-4 text-sm font-bold text-white"
          onClick={openNewProductModal}
          type="button"
        >
          Novo produto
        </button>
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <label className="block text-sm font-bold text-zinc-800" htmlFor="merchant-search">
          Buscar no catálogo
        </label>
        <input
          className="mt-2 h-12 w-full rounded-lg border border-zinc-300 bg-white px-4 text-base text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-teal-800 focus:ring-2 focus:ring-teal-100"
          id="merchant-search"
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Nome, categoria, ativo ou inativo"
          type="search"
          value={search}
        />

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {filters.map((item) => (
            <button
              className={`h-10 shrink-0 rounded-lg border px-4 text-sm font-semibold transition ${
                item === filter
                  ? "border-teal-800 bg-teal-800 text-white"
                  : "border-zinc-300 bg-white text-zinc-700"
              }`}
              key={item}
              onClick={() => setFilter(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-3">
        {filteredProducts.map((product) => (
          <article
            className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
            key={product.id}
          >
            <div className="grid gap-4 sm:grid-cols-[88px_1fr] lg:grid-cols-[88px_1fr_auto] lg:items-center">
              <div
                className={`flex h-24 items-center justify-center rounded-lg ${product.imageClass}`}
              >
                <div
                  className={`h-14 w-10 rounded-b-xl rounded-t-md border-2 shadow-md ${product.bottleClass}`}
                />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-bold text-zinc-950">{product.name}</h2>
                  <span
                    className={`rounded px-2 py-1 text-xs font-bold ${
                      product.active
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {product.active ? "Ativo" : "Inativo"}
                  </span>
                  {product.highlight ? (
                    <span className="rounded bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700">
                      Destaque
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-zinc-500">
                  {product.category} - {product.price}
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  {product.description}
                </p>
              </div>

              {/* Ações de demonstração: alteram apenas o estado local desta tela. */}
              <div className="grid grid-cols-3 gap-2 lg:w-72">
                <button
                  className="h-10 rounded-lg border border-zinc-300 bg-white text-sm font-semibold text-zinc-800"
                  onClick={() => openEditProductModal(product)}
                  type="button"
                >
                  Editar
                </button>
                <button
                  className="h-10 rounded-lg border border-zinc-300 bg-white text-sm font-semibold text-zinc-800"
                  onClick={() => toggleProductStatus(product.id)}
                  type="button"
                >
                  {product.active ? "Pausar" : "Ativar"}
                </button>
                <button
                  className="h-10 rounded-lg border border-red-200 bg-white text-sm font-semibold text-red-700"
                  onClick={() => setProductToRemove(product)}
                  type="button"
                >
                  Remover
                </button>
              </div>
            </div>
          </article>
        ))}

        {filteredProducts.length === 0 ? (
          <div className="rounded-lg border border-zinc-200 bg-white p-6 text-center shadow-sm">
            <h2 className="font-bold text-zinc-950">Nenhum produto encontrado</h2>
            <p className="mt-1 text-sm text-zinc-600">
              Tente outro termo de busca ou altere o filtro rápido.
            </p>
          </div>
        ) : null}
      </section>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-end bg-zinc-950/55 px-3 py-3 sm:items-center sm:justify-center">
          <form
            className="max-h-[92vh] w-full overflow-y-auto rounded-lg bg-white p-4 shadow-xl sm:max-w-2xl sm:p-6"
            onSubmit={saveProduct}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-teal-700">
                  Demonstração sem salvamento permanente
                </p>
                <h2 className="mt-1 text-2xl font-bold text-zinc-950">
                  {editingProduct ? "Editar produto" : "Novo produto"}
                </h2>
              </div>
              <button
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-bold text-zinc-800"
                onClick={closeModal}
                type="button"
              >
                Fechar
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-bold text-zinc-800">
                Nome do produto
                <input
                  className="mt-2 h-12 w-full rounded-lg border border-zinc-300 px-4 text-base font-normal outline-none focus:border-teal-800 focus:ring-2 focus:ring-teal-100"
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  required
                  value={form.name}
                />
              </label>

              <label className="block text-sm font-bold text-zinc-800">
                Categoria
                <input
                  className="mt-2 h-12 w-full rounded-lg border border-zinc-300 px-4 text-base font-normal outline-none focus:border-teal-800 focus:ring-2 focus:ring-teal-100"
                  onChange={(event) => setForm({ ...form, category: event.target.value })}
                  placeholder="Ex.: Femininos"
                  required
                  value={form.category}
                />
              </label>

              <label className="block text-sm font-bold text-zinc-800">
                Preço
                <input
                  className="mt-2 h-12 w-full rounded-lg border border-zinc-300 px-4 text-base font-normal outline-none focus:border-teal-800 focus:ring-2 focus:ring-teal-100"
                  onChange={(event) => setForm({ ...form, price: event.target.value })}
                  placeholder="R$ 129,90"
                  required
                  value={form.price}
                />
              </label>

              <label className="block text-sm font-bold text-zinc-800">
                Imagem do produto
                <select
                  className="mt-2 h-12 w-full rounded-lg border border-zinc-300 bg-white px-4 text-base font-normal outline-none focus:border-teal-800 focus:ring-2 focus:ring-teal-100"
                  onChange={(event) => setForm({ ...form, imageKey: event.target.value })}
                  value={form.imageKey}
                >
                  {imageOptions.map((option) => (
                    <option key={option.key} value={option.key}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="mt-4 block text-sm font-bold text-zinc-800">
              Descrição curta
              <textarea
                className="mt-2 min-h-24 w-full rounded-lg border border-zinc-300 px-4 py-3 text-base font-normal outline-none focus:border-teal-800 focus:ring-2 focus:ring-teal-100"
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                required
                value={form.description}
              />
            </label>

            <div className="mt-4 grid gap-3 sm:grid-cols-[180px_1fr] sm:items-center">
              <div
                className={`flex h-32 items-center justify-center rounded-lg ${
                  getImageOption(form.imageKey).imageClass
                }`}
              >
                <div
                  className={`h-20 w-14 rounded-b-xl rounded-t-md border-2 shadow-md ${
                    getImageOption(form.imageKey).bottleClass
                  }`}
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3 text-sm font-bold text-zinc-800">
                  <input
                    checked={form.highlight}
                    className="h-4 w-4 accent-teal-800"
                    onChange={(event) =>
                      setForm({ ...form, highlight: event.target.checked })
                    }
                    type="checkbox"
                  />
                  Produto em destaque
                </label>
                <label className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3 text-sm font-bold text-zinc-800">
                  <input
                    checked={form.active}
                    className="h-4 w-4 accent-teal-800"
                    onChange={(event) => setForm({ ...form, active: event.target.checked })}
                    type="checkbox"
                  />
                  Produto ativo
                </label>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                className="h-11 rounded-lg border border-zinc-300 bg-white px-4 text-sm font-bold text-zinc-900"
                onClick={closeModal}
                type="button"
              >
                Cancelar
              </button>
              <button
                className="h-11 rounded-lg bg-teal-800 px-4 text-sm font-bold text-white"
                type="submit"
              >
                Salvar produto
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {productToRemove ? (
        <div className="fixed inset-0 z-50 flex items-end bg-zinc-950/55 px-3 py-3 sm:items-center sm:justify-center">
          <div className="w-full rounded-lg bg-white p-4 shadow-xl sm:max-w-md sm:p-6">
            <h2 className="text-xl font-bold text-zinc-950">Remover produto</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Tem certeza que deseja remover este produto da demo?
            </p>
            <p className="mt-3 rounded-lg bg-stone-50 p-3 text-sm font-bold text-zinc-950">
              {productToRemove.name}
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                className="h-11 rounded-lg border border-zinc-300 bg-white px-4 text-sm font-bold text-zinc-900"
                onClick={() => setProductToRemove(null)}
                type="button"
              >
                Cancelar
              </button>
              <button
                className="h-11 rounded-lg bg-red-700 px-4 text-sm font-bold text-white"
                onClick={removeProduct}
                type="button"
              >
                Remover da demo
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
