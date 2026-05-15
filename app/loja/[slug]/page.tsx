import { notFound } from "next/navigation";
import { createPublicSupabaseClient } from "../../lib/supabase";
import { DemoStoreClient, PublicProduct, PublicStore } from "../demo/demo-store-client";

const defaultWhatsappMessage =
  "Ola! Tenho interesse no produto: {{nome_do_produto}}. Ainda esta disponivel?";

export const dynamic = "force-dynamic";

type SupabaseStore = {
  id: string;
  name: string;
  description: string | null;
  business_type: string | null;
  logo_url: string | null;
  whatsapp: string | null;
  whatsapp_message_template: string | null;
};

type SupabaseCategory = {
  id: string;
  name: string;
};

type SupabaseProduct = {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  is_active: boolean;
  is_featured: boolean;
};

type StorePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

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
    imageClass: "bg-[linear-gradient(135deg,#fef3c7,#fed7aa,#fde68a)]",
    bottleClass: "bg-amber-200 border-amber-300",
  },
  {
    imageClass: "bg-[linear-gradient(135deg,#ccfbf1,#f0fdfa,#d9f99d)]",
    bottleClass: "bg-teal-200 border-teal-300",
  },
  {
    imageClass: "bg-[linear-gradient(135deg,#f5f3ff,#ddd6fe,#fce7f3)]",
    bottleClass: "bg-violet-200 border-violet-300",
  },
];

function formatCurrency(price: number | null) {
  if (price === null) {
    return "Consulte";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}

async function getStoreData(slug: string) {
  const supabase = createPublicSupabaseClient();

  if (!supabase) {
    return null;
  }

  const { data: store, error: storeError } = await supabase
    .from("stores")
    .select("id, name, description, business_type, logo_url, whatsapp, whatsapp_message_template")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle<SupabaseStore>();

  if (storeError || !store) {
    return null;
  }

  const [{ data: categories, error: categoriesError }, { data: products, error: productsError }] =
    await Promise.all([
      supabase
        .from("categories")
        .select("id, name")
        .eq("store_id", store.id)
        .eq("is_active", true)
        .order("position", { ascending: true })
        .order("name", { ascending: true }),
      supabase
        .from("products")
        .select("id, category_id, name, description, price, image_url, is_active, is_featured")
        .eq("store_id", store.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false }),
    ]);

  if (categoriesError || productsError || !categories || !products) {
    return null;
  }

  const categoryById = new Map(
    (categories as SupabaseCategory[]).map((category) => [category.id, category.name]),
  );

  return {
    store: {
      name: store.name,
      segment: store.business_type ?? "Catalogo local",
      description: store.description ?? "",
      whatsapp: store.whatsapp ?? "",
      whatsappMessageTemplate: store.whatsapp_message_template ?? defaultWhatsappMessage,
      logoUrl: store.logo_url,
    } satisfies PublicStore,
    categories: ["Todos", ...(categories as SupabaseCategory[]).map((category) => category.name)],
    products: (products as SupabaseProduct[]).map((product, index) => {
      const placeholder = placeholderStyles[index % placeholderStyles.length];

      return {
        id: product.id,
        name: product.name,
        category: product.category_id ? categoryById.get(product.category_id) ?? "" : "",
        price: formatCurrency(product.price),
        description: product.description ?? "",
        active: product.is_active,
        highlight: product.is_featured,
        imageUrl: product.image_url,
        imageClass: product.image_url ? "bg-zinc-100" : placeholder.imageClass,
        bottleClass: placeholder.bottleClass,
      } satisfies PublicProduct;
    }),
  };
}

export default async function StorePage({ params }: StorePageProps) {
  const { slug } = await params;
  const data = await getStoreData(slug);

  if (!data) {
    notFound();
  }

  return <DemoStoreClient {...data} />;
}
