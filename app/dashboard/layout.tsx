import Link from "next/link";
import { getDashboardData } from "./dashboard-data";
import { SignOutButton } from "./sign-out-button";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { store } = await getDashboardData();
  const links = [
    { href: "/dashboard", label: "Resumo" },
    { href: "/dashboard/produtos", label: "Produtos" },
    { href: "/dashboard/configuracoes", label: "Configurações" },
    { href: store ? `/loja/${store.slug}` : "/loja/demo", label: "Ver loja" },
  ];

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-zinc-950">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              className="cursor-pointer text-base font-bold text-zinc-950 transition hover:text-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200"
              href="/"
            >
              Catalogo Local
            </Link>
            <span className="rounded-lg bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800">
              Demo
            </span>
          </div>
          <nav className="mt-4 flex max-w-full flex-wrap gap-2">
            {links.map((link) => (
              <Link
                className="shrink-0 cursor-pointer rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-800 shadow-sm transition hover:border-teal-700 hover:text-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200"
                href={link.href}
                key={link.href}
              >
                {link.label}
              </Link>
            ))}
            <SignOutButton />
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
    </main>
  );
}
