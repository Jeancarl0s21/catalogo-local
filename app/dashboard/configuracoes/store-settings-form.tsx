"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { DashboardStore } from "../dashboard-data";
import { createBrowserSupabaseClient } from "../../lib/supabase/browser";

const storeAssetsBucket = "store-assets";
const maxLogoSize = 2 * 1024 * 1024;
const allowedLogoTypes = ["image/jpeg", "image/png", "image/webp"];
const defaultWhatsappMessage =
  "Ola! Tenho interesse no produto: {{nome_do_produto}}. Ainda esta disponivel?";

type StoreSettingsFormProps = {
  store: DashboardStore | null;
};

type StoreForm = {
  name: string;
  businessType: string;
  description: string;
  whatsapp: string;
  whatsappMessageTemplate: string;
  isActive: boolean;
};

const emptyForm: StoreForm = {
  name: "",
  businessType: "",
  description: "",
  whatsapp: "",
  whatsappMessageTemplate: defaultWhatsappMessage,
  isActive: true,
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function onlyNumbers(value: string) {
  return value.replace(/\D/g, "");
}

function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configuredUrl) {
    return configuredUrl.replace(/\/+$/g, "");
  }

  return "http://localhost:3000";
}

function getFileExtension(file: File) {
  const extensionFromName = file.name.split(".").pop()?.toLowerCase();

  if (extensionFromName && ["jpg", "jpeg", "png", "webp"].includes(extensionFromName)) {
    return extensionFromName === "jpeg" ? "jpg" : extensionFromName;
  }

  if (file.type === "image/png") {
    return "png";
  }

  if (file.type === "image/webp") {
    return "webp";
  }

  return "jpg";
}

function buildLogoPath(authUserId: string, storeId: string, file: File, storeName: string) {
  const extension = getFileExtension(file);
  const baseName = slugify(storeName || file.name.replace(/\.[^.]+$/, "")) || "logo";

  return `${authUserId}/${storeId}/logo/${Date.now()}-${baseName}.${extension}`;
}

function storeToForm(store: DashboardStore | null): StoreForm {
  if (!store) {
    return emptyForm;
  }

  return {
    name: store.name,
    businessType: store.business_type ?? "",
    description: store.description ?? "",
    whatsapp: store.whatsapp ?? "",
    whatsappMessageTemplate: store.whatsapp_message_template ?? defaultWhatsappMessage,
    isActive: store.is_active,
  };
}

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return "CL";
  }

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function StoreSettingsForm({ store }: StoreSettingsFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<StoreForm>(() => storeToForm(store));
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(store?.logo_url ?? null);
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);
  const [currentLogoUrl, setCurrentLogoUrl] = useState<string | null>(store?.logo_url ?? null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(
    null,
  );

  useEffect(() => {
    return () => {
      if (logoPreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreviewUrl);
      }
    };
  }, [logoPreviewUrl]);

  const publicUrl = `${getSiteUrl()}/loja/${store?.slug ?? "demo"}`;
  const logoInitials = getInitials(form.name || store?.name || "");

  function updateForm(nextFields: Partial<StoreForm>) {
    setForm((currentForm) => ({ ...currentForm, ...nextFields }));
  }

  async function copyPublicUrl() {
    if (!store) {
      return;
    }

    try {
      await navigator.clipboard.writeText(publicUrl);
      setFeedback({ type: "success", text: "Link publico copiado." });
    } catch {
      setFeedback({ type: "error", text: "Nao foi possivel copiar o link publico." });
    }
  }

  function handleLogoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      setSelectedLogoFile(null);
      setLogoPreviewUrl(currentLogoUrl);
      return;
    }

    if (!allowedLogoTypes.includes(file.type)) {
      event.target.value = "";
      setSelectedLogoFile(null);
      setLogoPreviewUrl(currentLogoUrl);
      setFeedback({ type: "error", text: "Use uma logo em JPG, PNG ou WEBP." });
      return;
    }

    if (file.size > maxLogoSize) {
      event.target.value = "";
      setSelectedLogoFile(null);
      setLogoPreviewUrl(currentLogoUrl);
      setFeedback({ type: "error", text: "A logo deve ter no maximo 2 MB." });
      return;
    }

    if (logoPreviewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(logoPreviewUrl);
    }

    setFeedback(null);
    setSelectedLogoFile(file);
    setLogoPreviewUrl(URL.createObjectURL(file));
  }

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    if (!store) {
      setFeedback({ type: "error", text: "Crie uma loja antes de salvar Configurações." });
      return;
    }

    const cleanName = form.name.trim();

    if (!cleanName) {
      setFeedback({ type: "error", text: "Informe o nome da loja." });
      return;
    }

    const supabase = createBrowserSupabaseClient();

    if (!supabase) {
      setFeedback({ type: "error", text: "Supabase nao esta configurado neste ambiente." });
      return;
    }

    setIsSubmitting(true);

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    const authUserId = user?.id ?? session?.user.id ?? null;

    if (sessionError || userError || !session || !authUserId) {
      setIsSubmitting(false);
      setFeedback({ type: "error", text: "Sua sessao expirou. Entre novamente para salvar." });
      return;
    }

    if (!store.id) {
      setIsSubmitting(false);
      setFeedback({ type: "error", text: "Nao foi possivel identificar a loja." });
      return;
    }

    if (!store.owner_id) {
      setIsSubmitting(false);
      setFeedback({ type: "error", text: "Nao foi possivel identificar o dono da loja." });
      return;
    }

    if (store.owner_id !== authUserId) {
      setIsSubmitting(false);
      setFeedback({ type: "error", text: "A loja carregada nao pertence ao usuario logado." });
      return;
    }

    let nextLogoUrl = currentLogoUrl;
    let didUploadNewLogo = false;

    if (selectedLogoFile) {
      const logoPath = buildLogoPath(authUserId, store.id, selectedLogoFile, cleanName);
      const { error: uploadError } = await supabase.storage
        .from(storeAssetsBucket)
        .upload(logoPath, selectedLogoFile, {
          cacheControl: "3600",
          contentType: selectedLogoFile.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("Store logo upload failed", {
          bucket: storeAssetsBucket,
          message: uploadError.message,
          path: logoPath,
        });
        setIsSubmitting(false);
        setFeedback({ type: "error", text: "Nao foi possivel enviar a logo da loja." });
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from(storeAssetsBucket)
        .getPublicUrl(logoPath);

      nextLogoUrl = publicUrlData.publicUrl;
      didUploadNewLogo = true;
    }

    const { data, error } = await supabase
      .from("stores")
      .update({
        name: cleanName,
        business_type: form.businessType.trim() || null,
        description: form.description.trim() || null,
        whatsapp: onlyNumbers(form.whatsapp) || null,
        whatsapp_message_template:
          form.whatsappMessageTemplate.trim() || defaultWhatsappMessage,
        logo_url: nextLogoUrl,
        is_active: form.isActive,
      })
      .eq("id", store.id)
      .eq("owner_id", authUserId)
      .select(
        "id, owner_id, name, slug, business_type, description, whatsapp, is_active, logo_url, banner_url, primary_color, whatsapp_message_template",
      )
      .single<DashboardStore>();

    setIsSubmitting(false);

    if (error || !data) {
      setFeedback({
        type: "error",
        text: didUploadNewLogo
          ? "A logo foi enviada, mas nao foi possivel atualizar os dados da loja."
          : "Nao foi possivel salvar as Configurações.",
      });
      return;
    }

    if (logoPreviewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(logoPreviewUrl);
    }

    setForm(storeToForm(data));
    setCurrentLogoUrl(data.logo_url);
    setLogoPreviewUrl(data.logo_url);
    setSelectedLogoFile(null);
    router.refresh();
    setFeedback({ type: "success", text: "Configurações salvas com sucesso." });
  }

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-semibold text-teal-700">Loja</p>
        <h1 className="text-3xl font-bold text-zinc-950">Configurações</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
          Atualize os dados reais da loja, o link publico, o WhatsApp e a logo exibida na
          vitrine.
        </p>
      </section>

      {!store ? (
        <section className="rounded-lg border border-amber-200 bg-amber-50 p-4 shadow-sm">
          <h2 className="text-lg font-bold text-amber-950">Nenhuma loja encontrada</h2>
          <p className="mt-2 text-sm leading-6 text-amber-900">
            Crie manualmente uma loja em `stores` com `owner_id` igual ao usuario logado
            para preencher esta tela com dados reais.
          </p>
        </section>
      ) : null}

      {feedback ? (
        <p
          className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {feedback.text}
        </p>
      ) : null}

      <form className="space-y-4" onSubmit={saveSettings}>
        <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-950">Dados da loja</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-bold text-zinc-800" htmlFor="name">
              Nome da loja
              <input
                className="mt-2 h-12 w-full rounded-lg border border-zinc-300 px-4 font-normal outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                disabled={!store || isSubmitting}
                id="name"
                onChange={(event) => updateForm({ name: event.target.value })}
                placeholder="Nome da loja"
                type="text"
                value={form.name}
              />
            </label>

            <label className="block text-sm font-bold text-zinc-800" htmlFor="business-type">
              Tipo de comercio
              <input
                className="mt-2 h-12 w-full rounded-lg border border-zinc-300 px-4 font-normal outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                disabled={!store || isSubmitting}
                id="business-type"
                onChange={(event) => updateForm({ businessType: event.target.value })}
                placeholder="Ex.: roupas, variedades, perfumaria"
                type="text"
                value={form.businessType}
              />
            </label>
          </div>

          <label className="mt-4 block text-sm font-bold text-zinc-800" htmlFor="description">
            Descricao curta
            <textarea
              className="mt-2 min-h-28 w-full rounded-lg border border-zinc-300 px-4 py-3 font-normal outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
              disabled={!store || isSubmitting}
              id="description"
              onChange={(event) => updateForm({ description: event.target.value })}
              placeholder="Resumo da loja para a vitrine publica"
              value={form.description}
            />
          </label>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-950">Link publico</h2>
          <p className="mt-1 text-sm leading-6 text-zinc-600">
            Esse endereco e controlado pelo sistema para evitar links quebrados depois que
            ele for compartilhado.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-bold text-zinc-800" htmlFor="slug">
              Slug publico
              <input
                className="mt-2 h-12 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 font-normal text-zinc-600 outline-none"
                id="slug"
                readOnly
                type="text"
                value={store?.slug ?? ""}
              />
            </label>
          </div>

          <div className="mt-4 rounded-lg border border-zinc-200 bg-stone-50 p-3">
            <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
              Link publico completo
            </p>
            <a
              className="mt-1 block break-all text-sm font-bold text-teal-800 underline-offset-2 transition hover:underline"
              href={publicUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              {publicUrl}
            </a>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <button
                className="h-10 cursor-pointer rounded-lg border border-zinc-300 bg-white px-4 text-sm font-bold text-zinc-900 transition hover:border-teal-700 hover:text-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200 disabled:cursor-not-allowed disabled:text-zinc-400"
                disabled={!store}
                onClick={copyPublicUrl}
                type="button"
              >
                Copiar link
              </button>
              <a
                className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg bg-teal-800 px-4 text-sm font-bold text-white transition hover:bg-teal-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200"
                href={publicUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                Ver loja
              </a>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-950">WhatsApp</h2>
          <p className="mt-1 text-sm leading-6 text-zinc-600">
            Esse numero sera usado nos botoes Comprar pelo WhatsApp da vitrine.
          </p>

          <label className="mt-4 block text-sm font-bold text-zinc-800" htmlFor="whatsapp">
            Numero do WhatsApp
            <input
              className="mt-2 h-12 w-full rounded-lg border border-zinc-300 px-4 font-normal outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
              disabled={!store || isSubmitting}
              id="whatsapp"
              inputMode="numeric"
              onChange={(event) => updateForm({ whatsapp: onlyNumbers(event.target.value) })}
              placeholder="5581999999999"
              type="tel"
              value={form.whatsapp}
            />
          </label>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-950">Mensagem automatica</h2>
          <p className="mt-1 text-sm leading-6 text-zinc-600">
            O trecho {"{{nome_do_produto}}"} sera substituido automaticamente pelo produto
            clicado pelo cliente.
          </p>

          <label className="mt-4 block text-sm font-bold text-zinc-800" htmlFor="message">
            Texto padrao da mensagem
            <textarea
              className="mt-2 min-h-28 w-full rounded-lg border border-zinc-300 px-4 py-3 font-normal outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
              disabled={!store || isSubmitting}
              id="message"
              onChange={(event) =>
                updateForm({ whatsappMessageTemplate: event.target.value })
              }
              value={form.whatsappMessageTemplate}
            />
          </label>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-950">Logo da loja</h2>
          <p className="mt-1 text-sm leading-6 text-zinc-600">
            Use uma imagem quadrada, ate 2 MB, em JPG, PNG ou WEBP.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-[160px_1fr] sm:items-center">
            <div className="flex aspect-square w-32 items-center justify-center overflow-hidden rounded-lg border border-zinc-200 bg-stone-100 sm:w-40">
              {logoPreviewUrl ? (
                <div
                  aria-label="Logo da loja"
                  className="h-full w-full bg-cover bg-center"
                  role="img"
                  style={{ backgroundImage: `url(${logoPreviewUrl})` }}
                />
              ) : (
                <span className="text-3xl font-black text-teal-800">{logoInitials}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-800" htmlFor="store-logo">
                Arquivo da logo
                <input
                  accept="image/jpeg,image/png,image/webp"
                  className="mt-3 block w-full cursor-pointer rounded-lg border border-zinc-300 bg-white text-sm text-zinc-700 file:mr-4 file:h-11 file:cursor-pointer file:border-0 file:bg-teal-800 file:px-4 file:text-sm file:font-bold file:text-white hover:border-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200"
                  disabled={!store || isSubmitting}
                  id="store-logo"
                  onChange={handleLogoChange}
                  type="file"
                />
              </label>
              {selectedLogoFile ? (
                <p className="mt-2 text-xs font-semibold text-zinc-600">
                  Selecionado: {selectedLogoFile.name}
                </p>
              ) : currentLogoUrl ? (
                <p className="mt-2 text-xs font-semibold text-zinc-600">
                  A logo atual sera mantida se nenhuma nova imagem for escolhida.
                </p>
              ) : null}
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-950">Status da loja</h2>
          <p className="mt-1 text-sm leading-6 text-zinc-600">
            Se a loja estiver inativa, a vitrine publica nao deve aparecer para clientes.
          </p>

          <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-200 p-3 text-sm font-bold text-zinc-800 transition hover:border-teal-700 hover:bg-teal-50/40">
            <input
              checked={form.isActive}
              className="h-4 w-4 accent-teal-800"
              disabled={!store || isSubmitting}
              onChange={(event) => updateForm({ isActive: event.target.checked })}
              type="checkbox"
            />
            Loja ativa
          </label>
        </section>

        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <button
            className="h-11 w-full cursor-pointer rounded-lg bg-teal-800 px-4 text-sm font-bold text-white transition hover:bg-teal-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200 disabled:cursor-not-allowed disabled:bg-zinc-400 sm:w-auto"
            disabled={!store || isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Salvando..." : "Salvar alteracoes"}
          </button>
        </div>
      </form>
    </div>
  );
}
