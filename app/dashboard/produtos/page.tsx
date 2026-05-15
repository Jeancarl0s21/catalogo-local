import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "../../lib/supabase/server";
import { ProductsManager, ProductCategory, StoreProduct } from "./products-manager";

export const dynamic = "force-dynamic";

type StoreSummary = {
  id: string;
  name: string;
  owner_id: string;
};

export default async function DashboardProductsPage() {
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
    .select("id, name, owner_id")
    .eq("owner_id", user.id)
    .maybeSingle<StoreSummary>();

  if (!store) {
    return (
      <ProductsManager
        categories={[]}
        initialProducts={[]}
        store={null}
      />
    );
  }

  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase
      .from("categories")
      .select("id, name, is_active")
      .eq("store_id", store.id)
      .order("position", { ascending: true })
      .order("name", { ascending: true }),
    supabase
      .from("products")
      .select(
        "id, store_id, category_id, name, slug, description, price, image_url, is_active, is_featured, created_at",
      )
      .eq("store_id", store.id)
      .order("created_at", { ascending: false }),
  ]);

  return (
    <ProductsManager
      categories={(categories ?? []) as ProductCategory[]}
      initialProducts={(products ?? []) as StoreProduct[]}
      store={store}
    />
  );
}
