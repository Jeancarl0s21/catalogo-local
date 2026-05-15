"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { createBrowserSupabaseClient } from "../../lib/supabase/browser";

const filters = ["Todos", "Ativos", "Inativos", "Destaques"] as const;
const productImagesBucket = "product-images";
const maxImageSize = 2 * 1024 * 1024;
const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

const placeholderStyles = [
  {
    imageClass: "bg-[linear-gradient(135deg,#fff1f2,#fbcfe8,#fef3c7)]",
    bottleClass: "bg-rose-200 border-rose-300",
  },
  {
    imageClass: "bg-[linear-gradient(135deg,#e7e5e4,#78716c,#1c1917)]",
    bottleClass: "bg-stone-700 border-stone-500",
  },
  {
    imageClass: "bg-[linear-gradient(135deg,#ecfccb,#bbf7d0,#bae6fd)]",
    bottleClass: "bg-lime-200 border-lime-300",
  },
  {
    imageClass: "bg-[linear-gradient(135deg,#ccfbf1,#f0fdfa,#d9f99d)]",
    bottleClass: "bg-teal-200 border-teal-300",
  },
];

type Filter = (typeof filters)[number];

export type ProductCategory = {
  id: string;
  name: string;
  is_active: boolean;
};

export type StoreProduct = {
  id: string;
  store_id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
};

type StoreSummary = {
  id: string;
  name: string;
  owner_id: string;
};

type ProductForm = {
  name: string;
  slug: string;
  categoryId: string;
  price: string;
  description: string;
  isFeatured: boolean;
  isActive: boolean;
};

type ProductsManagerProps = {
  store: StoreSummary | null;
  categories: ProductCategory[];
  initialProducts: StoreProduct[];
};

const emptyForm: ProductForm = {
  name: "",
  slug: "",
  categoryId: "",
  price: "",
  description: "",
  isFeatured: false,
  isActive: true,
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatPrice(price: number | null) {
  if (price === null) {
    return "Consulte";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}

function parsePrice(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  const normalized = trimmed
    .replace(/[^\d,.]/g, "")
    .replace(/\.(?=\d{3}(?:\D|$))/g, "")
    .replace(",", ".");
  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : null;
}

function productToForm(product: StoreProduct): ProductForm {
  return {
    name: product.name,
    slug: product.slug,
    categoryId: product.category_id ?? "",
    price: product.price === null ? "" : String(product.price).replace(".", ","),
    description: product.description ?? "",
    isFeatured: product.is_featured,
    isActive: product.is_active,
  };
}

function getFileExtension(file: File) {
  const extensionFromName = file.name.split(".").pop()?.toLowerCase();

  if (extensionFromName && ["jpg", "jpeg", "png", "webp"].includes(extensionFromName)) {
    return extensionFromName === "jpeg" ? "jpg" : extensionFromName;
  }

  if (file.type === "image/png") {
    return "png";
  }

  if (file.type === "image/webp") {
    return "webp";
  }

  return "jpg";
}

function buildImagePath(storeId: string, file: File, productName: string) {
  const extension = getFileExtension(file);
  const baseName = slugify(productName || file.name.replace(/\.[^.]+$/, "")) || "produto";

  return `${storeId}/${Date.now()}-${baseName}.${extension}`;
}

export function ProductsManager({ store, categories, initialProducts }: ProductsManagerProps) {
  const [products, setProducts] = useState<StoreProduct[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("Todos");
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editingProduct, setEditingProduct] = useState<StoreProduct | null>(null);
  const [productToRemove, setProductToRemove] = useState<StoreProduct | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionProductId, setActionProductId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(
    null,
  );

  const categoryById = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories],
  );

  useEffect(() => {
    return () => {
      if (imagePreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return products.filter((product) => {
      const categoryName = categoryById.get(product.category_id ?? "") ?? "Sem categoria";
      const status = product.is_active ? "ativo" : "inativo";
      const matchesSearch =
        product.name.toLowerCase().includes(normalizedSearch) ||
        categoryName.toLowerCase().includes(normalizedSearch) ||
        status.includes(normalizedSearch);

      const matchesFilter =
        filter === "Todos" ||
        (filter === "Ativos" && product.is_active) ||
        (filter === "Inativos" && !product.is_active) ||
        (filter === "Destaques" && product.is_featured);

      return matchesSearch && matchesFilter;
    });
  }, [categoryById, filter, products, search]);

  function openNewProductModal() {
    setFeedback(null);
    setEditingProduct(null);
    setForm(emptyForm);
    setSelectedImageFile(null);
    setImagePreviewUrl(null);
    setIsModalOpen(true);
  }

  function openEditProductModal(product: StoreProduct) {
    setFeedback(null);
    setEditingProduct(product);
    setForm(productToForm(product));
    setSelectedImageFile(null);
    setImagePreviewUrl(product.image_url);
    setIsModalOpen(true);
  }

  function closeModal() {
    if (imagePreviewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreviewUrl);
    }

    setIsModalOpen(false);
    setEditingProduct(null);
    setForm(emptyForm);
    setSelectedImageFile(null);
    setImagePreviewUrl(null);
    setIsSubmitting(false);
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      setSelectedImageFile(null);
      setImagePreviewUrl(editingProduct?.image_url ?? null);
      return;
    }

    if (!allowedImageTypes.includes(file.type)) {
      event.target.value = "";
      setSelectedImageFile(null);
      setImagePreviewUrl(editingProduct?.image_url ?? null);
      setFeedback({ type: "error", text: "Use uma imagem em JPG, PNG ou WEBP." });
      return;
    }

    if (file.size > maxImageSize) {
      event.target.value = "";
      setSelectedImageFile(null);
      setImagePreviewUrl(editingProduct?.image_url ?? null);
      setFeedback({ type: "error", text: "A imagem deve ter no maximo 2 MB." });
      return;
    }

    if (imagePreviewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreviewUrl);
    }

    setFeedback(null);
    setSelectedImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    if (!store) {
      setFeedback({ type: "error", text: "Crie uma loja antes de cadastrar produtos." });
      return;
    }

    const supabase = createBrowserSupabaseClient();

    if (!supabase) {
      setFeedback({ type: "error", text: "Supabase nao esta configurado neste ambiente." });
      return;
    }

    const cleanName = form.name.trim();
    const cleanSlug = slugify(form.slug || cleanName);

    if (!cleanName || !cleanSlug) {
      setFeedback({ type: "error", text: "Informe nome e slug valido para o produto." });
      return;
    }

    setIsSubmitting(true);

    let nextImageUrl = editingProduct?.image_url ?? null;

    if (selectedImageFile) {
      if (!store.id) {
        setIsSubmitting(false);
        setFeedback({ type: "error", text: "Nao foi possivel identificar a loja para enviar a imagem." });
        return;
      }

      const imagePath = buildImagePath(store.id, selectedImageFile, cleanName);
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      const authUserId = user?.id ?? session?.user.id ?? null;

      console.info("Product image upload auth check", {
        hasSession: Boolean(session),
        authUserId,
        storeId: store.id,
        storeOwnerId: store.owner_id,
        ownerMatchesUser: Boolean(authUserId && store.owner_id === authUserId),
        bucket: productImagesBucket,
        path: imagePath,
      });

      if (sessionError || userError || !session || !authUserId) {
        setIsSubmitting(false);
        setFeedback({ type: "error", text: "Sua sessao expirou. Entre novamente para enviar imagens." });
        return;
      }

      if (store.owner_id !== authUserId) {
        setIsSubmitting(false);
        setFeedback({ type: "error", text: "A loja carregada nao pertence ao usuario logado." });
        return;
      }

      const { error: uploadError } = await supabase.storage
        .from(productImagesBucket)
        .upload(imagePath, selectedImageFile, {
          cacheControl: "3600",
          contentType: selectedImageFile.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("Product image upload failed", {
          message: uploadError.message,
          bucket: productImagesBucket,
          path: imagePath,
        });
        setIsSubmitting(false);
        setFeedback({ type: "error", text: "Nao foi possivel enviar a imagem." });
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from(productImagesBucket)
        .getPublicUrl(imagePath);

      nextImageUrl = publicUrlData.publicUrl;
    }

    const productData = {
      name: cleanName,
      slug: cleanSlug,
      description: form.description.trim() || null,
      price: parsePrice(form.price),
      category_id: form.categoryId || null,
      image_url: nextImageUrl,
      is_active: form.isActive,
      is_featured: form.isFeatured,
    };

    if (editingProduct) {
      const { data, error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", editingProduct.id)
        .eq("store_id", store.id)
        .select(
          "id, store_id, category_id, name, slug, description, price, image_url, is_active, is_featured, created_at",
        )
        .single<StoreProduct>();

      setIsSubmitting(false);

      if (error || !data) {
        setFeedback({ type: "error", text: "Nao foi possivel salvar o produto." });
        return;
      }

      setProducts((currentProducts) =>
        currentProducts.map((product) => (product.id === data.id ? data : product)),
      );
      closeModal();
      setFeedback({ type: "success", text: "Produto atualizado com sucesso." });
      return;
    }

    const { data, error } = await supabase
      .from("products")
      .insert({
        ...productData,
        store_id: store.id,
      })
      .select(
        "id, store_id, category_id, name, slug, description, price, image_url, is_active, is_featured, created_at",
      )
      .single<StoreProduct>();

    setIsSubmitting(false);

    if (error || !data) {
      setFeedback({ type: "error", text: "Nao foi possivel criar o produto." });
      return;
    }

    setProducts((currentProducts) => [data, ...currentProducts]);
    closeModal();
    setFeedback({ type: "success", text: "Produto criado com sucesso." });
  }

  async function toggleProductStatus(product: StoreProduct) {
    if (!store) {
      return;
    }

    const supabase = createBrowserSupabaseClient();

    if (!supabase) {
      setFeedback({ type: "error", text: "Supabase nao esta configurado neste ambiente." });
      return;
    }

    setActionProductId(product.id);
    setFeedback(null);

    const { data, error } = await supabase
      .from("products")
      .update({ is_active: !product.is_active })
      .eq("id", product.id)
      .eq("store_id", store.id)
      .select(
        "id, store_id, category_id, name, slug, description, price, image_url, is_active, is_featured, created_at",
      )
      .single<StoreProduct>();

    setActionProductId(null);

    if (error || !data) {
      setFeedback({ type: "error", text: "Nao foi possivel atualizar o status." });
      return;
    }

    setProducts((currentProducts) =>
      currentProducts.map((currentProduct) =>
        currentProduct.id === data.id ? data : currentProduct,
      ),
    );
    setFeedback({ type: "success", text: data.is_active ? "Produto ativado." : "Produto pausado." });
  }

  async function removeProduct() {
    if (!store || !productToRemove) {
      return;
    }

    const supabase = createBrowserSupabaseClient();

    if (!supabase) {
      setFeedback({ type: "error", text: "Supabase nao esta configurado neste ambiente." });
      return;
    }

    setActionProductId(productToRemove.id);
    setFeedback(null);

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productToRemove.id)
      .eq("store_id", store.id);

    setActionProductId(null);

    if (error) {
      setFeedback({ type: "error", text: "Nao foi possivel remover o produto." });
      return;
    }

    setProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== productToRemove.id),
    );
    setProductToRemove(null);
    setFeedback({ type: "success", text: "Produto removido com sucesso." });
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-teal-700">Catálogo</p>
          <h1 className="text-3xl font-bold text-zinc-950">Produtos</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
            Gerencie os produtos reais da loja {store ? store.name : "vinculada ao login"}.
          </p>
        </div>
        <button
          className="h-11 cursor-pointer rounded-lg bg-teal-800 px-4 text-sm font-bold text-white transition hover:bg-teal-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200 disabled:cursor-not-allowed disabled:bg-zinc-400"
          disabled={!store}
          onClick={openNewProductModal}
          type="button"
        >
          Novo produto
        </button>
      </section>

      {!store ? (
        <section className="rounded-lg border border-amber-200 bg-amber-50 p-4 shadow-sm">
          <h2 className="text-lg font-bold text-amber-950">Nenhuma loja encontrada</h2>
          <p className="mt-2 text-sm leading-6 text-amber-900">
            Crie manualmente uma loja em `stores` com `owner_id` igual ao usuário logado
            antes de cadastrar produtos.
          </p>
        </section>
      ) : null}

      {feedback ? (
        <p
          className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {feedback.text}
        </p>
      ) : null}

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

        <div className="mt-4 flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              className={`h-10 shrink-0 cursor-pointer rounded-lg border px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200 ${
                item === filter
                  ? "border-teal-800 bg-teal-800 text-white"
                  : "border-zinc-300 bg-white text-zinc-700 hover:border-teal-700 hover:text-teal-800"
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
        {filteredProducts.map((product, index) => {
          const placeholder = placeholderStyles[index % placeholderStyles.length];
          const categoryName = categoryById.get(product.category_id ?? "") ?? "Sem categoria";

          return (
            <article
              className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
              key={product.id}
            >
              <div className="grid gap-4 sm:grid-cols-[88px_1fr] lg:grid-cols-[88px_1fr_auto] lg:items-center">
                <div
                  className={`flex h-24 items-center justify-center overflow-hidden rounded-lg ${
                    product.image_url ? "bg-zinc-100" : placeholder.imageClass
                  }`}
                >
                  {product.image_url ? (
                    <div
                      aria-label={product.name}
                      className="h-full w-full bg-cover bg-center"
                      role="img"
                      style={{ backgroundImage: `url(${product.image_url})` }}
                    />
                  ) : (
                    <div
                      className={`h-14 w-10 rounded-b-xl rounded-t-md border-2 shadow-md ${placeholder.bottleClass}`}
                    />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="break-words font-bold text-zinc-950">{product.name}</h2>
                    <span
                      className={`rounded px-2 py-1 text-xs font-bold ${
                        product.is_active
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {product.is_active ? "Ativo" : "Inativo"}
                    </span>
                    {product.is_featured ? (
                      <span className="rounded bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700">
                        Destaque
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-zinc-500">
                    {categoryName} - {formatPrice(product.price)}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    {product.description || "Sem descrição cadastrada."}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 lg:w-72">
                  <button
                    className="h-10 cursor-pointer rounded-lg border border-zinc-300 bg-white text-sm font-semibold text-zinc-800 transition hover:border-teal-700 hover:text-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200"
                    onClick={() => openEditProductModal(product)}
                    type="button"
                  >
                    Editar
                  </button>
                  <button
                    className="h-10 cursor-pointer rounded-lg border border-zinc-300 bg-white text-sm font-semibold text-zinc-800 transition hover:border-teal-700 hover:text-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200 disabled:cursor-not-allowed disabled:text-zinc-400"
                    disabled={actionProductId === product.id}
                    onClick={() => toggleProductStatus(product)}
                    type="button"
                  >
                    {product.is_active ? "Pausar" : "Ativar"}
                  </button>
                  <button
                    className="h-10 cursor-pointer rounded-lg border border-red-200 bg-white text-sm font-semibold text-red-700 transition hover:border-red-400 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-100"
                    onClick={() => setProductToRemove(product)}
                    type="button"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </article>
          );
        })}

        {filteredProducts.length === 0 ? (
          <div className="rounded-lg border border-zinc-200 bg-white p-6 text-center shadow-sm">
            <h2 className="font-bold text-zinc-950">Nenhum produto encontrado</h2>
            <p className="mt-1 text-sm text-zinc-600">
              {products.length === 0
                ? "Cadastre o primeiro produto real da loja."
                : "Tente outro termo de busca ou altere o filtro rápido."}
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
                <p className="text-sm font-semibold text-teal-700">Produto real no Supabase</p>
                <h2 className="mt-1 text-2xl font-bold text-zinc-950">
                  {editingProduct ? "Editar produto" : "Novo produto"}
                </h2>
              </div>
              <button
                className="cursor-pointer rounded-lg border border-zinc-300 px-3 py-2 text-sm font-bold text-zinc-800 transition hover:border-teal-700 hover:text-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200"
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
                Slug
                <input
                  className="mt-2 h-12 w-full rounded-lg border border-zinc-300 px-4 text-base font-normal outline-none focus:border-teal-800 focus:ring-2 focus:ring-teal-100"
                  onChange={(event) => setForm({ ...form, slug: event.target.value })}
                  placeholder="Gerado pelo nome se ficar vazio"
                  value={form.slug}
                />
              </label>

              <label className="block text-sm font-bold text-zinc-800">
                Categoria
                <select
                  className="mt-2 h-12 w-full rounded-lg border border-zinc-300 bg-white px-4 text-base font-normal outline-none focus:border-teal-800 focus:ring-2 focus:ring-teal-100"
                  onChange={(event) => setForm({ ...form, categoryId: event.target.value })}
                  value={form.categoryId}
                >
                  <option value="">Sem categoria</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                      {category.is_active ? "" : " (inativa)"}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-bold text-zinc-800">
                Preço
                <input
                  className="mt-2 h-12 w-full rounded-lg border border-zinc-300 px-4 text-base font-normal outline-none focus:border-teal-800 focus:ring-2 focus:ring-teal-100"
                  onChange={(event) => setForm({ ...form, price: event.target.value })}
                  placeholder="129,90"
                  value={form.price}
                />
              </label>
            </div>

            <div className="mt-4 rounded-lg border border-zinc-200 bg-stone-50 p-3">
              <label className="block text-sm font-bold text-zinc-800" htmlFor="product-image">
                Imagem do produto
              </label>
              <p className="mt-1 text-xs leading-5 text-zinc-600">
                Recomendado: imagem quadrada, até 2 MB, em JPG, PNG ou WEBP.
              </p>
              <input
                accept="image/jpeg,image/png,image/webp"
                className="mt-3 block w-full cursor-pointer rounded-lg border border-zinc-300 bg-white text-sm text-zinc-700 file:mr-4 file:h-11 file:cursor-pointer file:border-0 file:bg-teal-800 file:px-4 file:text-sm file:font-bold file:text-white hover:border-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200"
                id="product-image"
                onChange={handleImageChange}
                type="file"
              />
              {selectedImageFile ? (
                <p className="mt-2 text-xs font-semibold text-zinc-600">
                  Selecionado: {selectedImageFile.name}
                </p>
              ) : editingProduct?.image_url ? (
                <p className="mt-2 text-xs font-semibold text-zinc-600">
                  Imagem atual será mantida se nenhuma nova imagem for escolhida.
                </p>
              ) : null}
            </div>

            <label className="mt-4 block text-sm font-bold text-zinc-800">
              Descrição curta
              <textarea
                className="mt-2 min-h-24 w-full rounded-lg border border-zinc-300 px-4 py-3 text-base font-normal outline-none focus:border-teal-800 focus:ring-2 focus:ring-teal-100"
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                value={form.description}
              />
            </label>

            <div className="mt-4 grid gap-3 sm:grid-cols-[180px_1fr] sm:items-center">
              <div className="flex h-32 items-center justify-center overflow-hidden rounded-lg bg-stone-100">
                {imagePreviewUrl ? (
                  <div
                    aria-label="Prévia da imagem"
                    className="h-full w-full bg-cover bg-center"
                    role="img"
                    style={{ backgroundImage: `url(${imagePreviewUrl})` }}
                  />
                ) : (
                  <div className="h-20 w-14 rounded-b-xl rounded-t-md border-2 border-teal-300 bg-teal-200 shadow-md" />
                )}
              </div>

              <div className="space-y-3">
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-200 p-3 text-sm font-bold text-zinc-800 transition hover:border-teal-700 hover:bg-teal-50/40">
                  <input
                    checked={form.isFeatured}
                    className="h-4 w-4 accent-teal-800"
                    onChange={(event) =>
                      setForm({ ...form, isFeatured: event.target.checked })
                    }
                    type="checkbox"
                  />
                  Produto em destaque
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-200 p-3 text-sm font-bold text-zinc-800 transition hover:border-teal-700 hover:bg-teal-50/40">
                  <input
                    checked={form.isActive}
                    className="h-4 w-4 accent-teal-800"
                    onChange={(event) => setForm({ ...form, isActive: event.target.checked })}
                    type="checkbox"
                  />
                  Produto ativo
                </label>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                className="h-11 cursor-pointer rounded-lg border border-zinc-300 bg-white px-4 text-sm font-bold text-zinc-900 transition hover:border-teal-700 hover:text-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200 disabled:cursor-not-allowed disabled:text-zinc-400"
                disabled={isSubmitting}
                onClick={closeModal}
                type="button"
              >
                Cancelar
              </button>
              <button
                className="h-11 cursor-pointer rounded-lg bg-teal-800 px-4 text-sm font-bold text-white transition hover:bg-teal-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200 disabled:cursor-not-allowed disabled:bg-zinc-400"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? "Salvando..." : "Salvar produto"}
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
              Tem certeza que deseja remover este produto da loja?
            </p>
            <p className="mt-3 rounded-lg bg-stone-50 p-3 text-sm font-bold text-zinc-950">
              {productToRemove.name}
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                className="h-11 cursor-pointer rounded-lg border border-zinc-300 bg-white px-4 text-sm font-bold text-zinc-900 transition hover:border-teal-700 hover:text-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200 disabled:cursor-not-allowed disabled:text-zinc-400"
                disabled={actionProductId === productToRemove.id}
                onClick={() => setProductToRemove(null)}
                type="button"
              >
                Cancelar
              </button>
              <button
                className="h-11 cursor-pointer rounded-lg bg-red-700 px-4 text-sm font-bold text-white transition hover:bg-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-100 disabled:cursor-not-allowed disabled:bg-zinc-400"
                disabled={actionProductId === productToRemove.id}
                onClick={removeProduct}
                type="button"
              >
                {actionProductId === productToRemove.id ? "Removendo..." : "Remover"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
