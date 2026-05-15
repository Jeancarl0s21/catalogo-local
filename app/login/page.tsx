import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "../lib/supabase/server";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const supabase = await createServerSupabaseClient();

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      redirect("/dashboard");
    }
  }

  return (
    <main className="min-h-screen bg-[#fbfaf7] px-4 py-8 text-zinc-950">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm lg:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-teal-950 p-6 text-white sm:p-8">
            <Link
              className="cursor-pointer text-base font-bold text-white transition hover:text-teal-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              href="/"
            >
              Catalogo Local
            </Link>
            <div className="mt-12 space-y-4">
              <p className="text-sm font-semibold text-teal-100">Area do lojista</p>
              <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
                Entre para gerenciar sua vitrine.
              </h1>
              <p className="text-sm leading-6 text-teal-50 sm:text-base">
                Acesse produtos, configuracoes e o resumo da loja em um painel simples para
                pequenos comercios.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div>
              <p className="text-sm font-semibold text-teal-800">Login</p>
              <h2 className="mt-2 text-2xl font-bold text-zinc-950">Acesse sua conta</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Use o email e a senha cadastrados no Supabase Auth.
              </p>
            </div>

            <LoginForm />
          </div>
        </div>
      </section>
    </main>
  );
}
