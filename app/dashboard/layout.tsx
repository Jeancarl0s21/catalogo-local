import Link from "next/link";

const links = [
  { href: "/dashboard", label: "Resumo" },
  { href: "/dashboard/produtos", label: "Produtos" },
  { href: "/dashboard/configuracoes", label: "Configurações" },
  { href: "/loja/demo", label: "Loja demo" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#fbfaf7] text-zinc-950">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link className="text-base font-bold text-zinc-950" href="/">
              Catálogo Local
            </Link>
            <span className="rounded-lg bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800">
              Demo
            </span>
          </div>
          <nav className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {links.map((link) => (
              <Link
                className="shrink-0 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-800 shadow-sm"
                href={link.href}
                key={link.href}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
    </main>
  );
}
