import { getDashboardData } from "../dashboard-data";
import { StoreSettingsForm } from "./store-settings-form";

export const dynamic = "force-dynamic";

export default async function DashboardSettingsPage() {
  const { store } = await getDashboardData();

  return <StoreSettingsForm store={store} />;
}
