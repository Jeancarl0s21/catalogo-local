"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createBrowserSupabaseClient } from "../lib/supabase/browser";

export function SignOutButton() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    const supabase = createBrowserSupabaseClient();

    setIsSigningOut(true);

    if (supabase) {
      await supabase.auth.signOut();
    }

    router.push("/login");
    router.refresh();
  }

  return (
    <button
      className="shrink-0 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-800 shadow-sm transition hover:border-red-300 hover:text-red-700 disabled:cursor-not-allowed disabled:text-zinc-400"
      disabled={isSigningOut}
      onClick={handleSignOut}
      type="button"
    >
      {isSigningOut ? "Saindo..." : "Sair"}
    </button>
  );
}
