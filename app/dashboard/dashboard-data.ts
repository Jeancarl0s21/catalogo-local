import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "../lib/supabase/server";

export type DashboardStore = {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  business_type: string | null;
  description: string | null;
  whatsapp: string | null;
  is_active: boolean;
  logo_url: string | null;
  banner_url: string | null;
  primary_color: string | null;
  whatsapp_message_template: string | null;
};

export type DashboardProduct = {
  id: string;
  name: string;
  price: number | null;
  is_active: boolean;
  is_featured: boolean;
  image_url: string | null;
  category_id: string | null;
  created_at: string;
};

export type DashboardData = {
  store: DashboardStore | null;
  productCount: number;
  activeProductCount: number;
  activeCategoryCount: number;
  latestProducts: DashboardProduct[];
  categoryById: Map<string, string>;
};

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    redirect("/login");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: store } = await supabase
    .from("stores")
    .select(
      "id, owner_id, name, slug, business_type, description, whatsapp, is_active, logo_url, banner_url, primary_color, whatsapp_message_template",
    )
    .eq("owner_id", user.id)
    .maybeSingle<DashboardStore>();

  if (!store) {
    return {
      store: null,
      productCount: 0,
      activeProductCount: 0,
      activeCategoryCount: 0,
      latestProducts: [],
      categoryById: new Map(),
    };
  }

  const [
    { count: productCount },
    { count: activeProductCount },
    { data: categories, count: activeCategoryCount },
    { data: latestProducts },
  ] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }).eq("store_id", store.id),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("store_id", store.id)
      .eq("is_active", true),
    supabase
      .from("categories")
      .select("id, name", { count: "exact" })
      .eq("store_id", store.id)
      .eq("is_active", true)
      .order("position", { ascending: true })
      .order("name", { ascending: true }),
    supabase
      .from("products")
      .select("id, name, price, is_active, is_featured, image_url, category_id, created_at")
      .eq("store_id", store.id)
      .order("created_at", { ascending: false })
      .limit(4),
  ]);

  return {
    store,
    productCount: productCount ?? 0,
    activeProductCount: activeProductCount ?? 0,
    activeCategoryCount: activeCategoryCount ?? 0,
    latestProducts: (latestProducts ?? []) as DashboardProduct[],
    categoryById: new Map(
      ((categories ?? []) as { id: string; name: string }[]).map((category) => [
        category.id,
        category.name,
      ]),
    ),
  };
}

export function formatPrice(price: number | null) {
  if (price === null) {
    return "Consulte";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}
