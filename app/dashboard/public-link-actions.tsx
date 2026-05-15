"use client";

import Link from "next/link";
import { useState } from "react";

type PublicLinkActionsProps = {
  publicPath: string;
  publicUrl: string;
};

export function PublicLinkActions({ publicPath, publicUrl }: PublicLinkActionsProps) {
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  async function copyPublicLink() {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopyFeedback("Link copiado.");
    } catch {
      setCopyFeedback("Nao foi possivel copiar.");
    }
  }

  return (
    <div className="space-y-2">
      <div className="grid gap-3 sm:grid-cols-3">
        <Link
          className="flex h-11 cursor-pointer items-center justify-center rounded-lg bg-teal-800 px-4 text-sm font-bold text-white transition hover:bg-teal-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200"
          href={publicPath}
          target="_blank"
        >
          Abrir loja
        </Link>
        <button
          className="h-11 cursor-pointer rounded-lg border border-zinc-300 bg-white px-4 text-sm font-bold text-zinc-900 transition hover:border-teal-700 hover:text-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200"
          onClick={copyPublicLink}
          type="button"
        >
          Copiar link
        </button>
        <Link
          className="flex h-11 cursor-pointer items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 text-sm font-bold text-zinc-900 transition hover:border-teal-700 hover:text-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200"
          href="/dashboard/configuracoes"
        >
          Ver configuracoes
        </Link>
      </div>
      {copyFeedback ? (
        <p className="text-xs font-semibold text-zinc-600">{copyFeedback}</p>
      ) : null}
    </div>
  );
}
