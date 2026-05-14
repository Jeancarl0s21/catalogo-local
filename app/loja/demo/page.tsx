import { categories as mockCategories, products as mockProducts, store as mockStore } from "../../lib/mock-data";
import { createPublicSupabaseClient } from "../../lib/supabase";
import { DemoStoreClient, PublicProduct, PublicStore } from "./demo-store-client";

const defaultWhatsappMessage =
  "Olá! Tenho interesse no produto: {{nome_do_produto}}. Ainda está disponível?";

export const dynamic = "force-dynamic";

type SupabaseStore = {
  id: string;
  name: string;
  description: string | null;
  business_type: string | null;
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

type DemoStoreData = {
  store: PublicStore;
  categories: string[];
  products: PublicProduct[];
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

function getMockStoreData(): DemoStoreData {
  return {
    store: {
      name: mockStore.name,
      segment: mockStore.segment,
      description: mockStore.description,
      whatsapp: mockStore.whatsapp,
      whatsappMessageTemplate: defaultWhatsappMessage,
    },
    categories: mockCategories,
    products: mockProducts,
  };
}

async function getSupabaseStoreData(): Promise<DemoStoreData | null> {
  const supabase = createPublicSupabaseClient();

  if (!supabase) {
    return null;
  }

  const { data: store, error: storeError } = await supabase
    .from("stores")
    .select("id, name, description, business_type, whatsapp, whatsapp_message_template")
    .eq("slug", "demo")
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
      description: store.description ?? mockStore.description,
      whatsapp: store.whatsapp ?? mockStore.whatsapp,
      whatsappMessageTemplate: store.whatsapp_message_template ?? defaultWhatsappMessage,
    },
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
      };
    }),
  };
}

export default async function DemoStorePage() {
  const data = (await getSupabaseStoreData()) ?? getMockStoreData();

  return <DemoStoreClient {...data} />;
}
