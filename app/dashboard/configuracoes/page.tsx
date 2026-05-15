import { getDashboardData } from "../dashboard-data";

const defaultWhatsappMessage =
  "Olá! Tenho interesse no produto: {{nome_do_produto}}. Ainda está disponível?";

export const dynamic = "force-dynamic";

export default async function DashboardSettingsPage() {
  const { store } = await getDashboardData();
  const publicLink = store ? `/loja/${store.slug}` : "/loja/demo";

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-semibold text-teal-700">Loja</p>
        <h1 className="text-3xl font-bold text-zinc-950">Configurações</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
          Confira como a loja aparece para os clientes. Os campos já carregam dados reais
          do Supabase, mas o salvamento será implementado na próxima etapa.
        </p>
      </section>

      {!store ? (
        <section className="rounded-lg border border-amber-200 bg-amber-50 p-4 shadow-sm">
          <h2 className="text-lg font-bold text-amber-950">Nenhuma loja encontrada</h2>
          <p className="mt-2 text-sm leading-6 text-amber-900">
            Crie manualmente uma loja em `stores` com `owner_id` igual ao usuário logado
            para preencher esta tela com dados reais.
          </p>
        </section>
      ) : null}

      <form className="space-y-4">
        <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-950">Dados da loja</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-bold text-zinc-800" htmlFor="name">
              Nome da loja
              <input
                className="mt-2 h-12 w-full rounded-lg border border-zinc-300 px-4 font-normal outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                defaultValue={store?.name ?? ""}
                id="name"
                placeholder="Nome da loja"
                type="text"
              />
            </label>

            <label className="block text-sm font-bold text-zinc-800" htmlFor="business-type">
              Tipo de comércio
              <input
                className="mt-2 h-12 w-full rounded-lg border border-zinc-300 px-4 font-normal outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                defaultValue={store?.business_type ?? ""}
                id="business-type"
                placeholder="Ex.: roupas, variedades, perfumaria"
                type="text"
              />
            </label>
          </div>

          <label className="mt-4 block text-sm font-bold text-zinc-800" htmlFor="description">
            Descrição curta
            <textarea
              className="mt-2 min-h-28 w-full rounded-lg border border-zinc-300 px-4 py-3 font-normal outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
              defaultValue={store?.description ?? ""}
              id="description"
              placeholder="Resumo da loja para a vitrine pública"
            />
          </label>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-950">Link público</h2>
          <p className="mt-1 text-sm leading-6 text-zinc-600">
            Esse é o endereço que pode ser compartilhado com clientes.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <label className="block text-sm font-bold text-zinc-800" htmlFor="slug">
              Slug público
              <input
                className="mt-2 h-12 w-full rounded-lg border border-zinc-300 px-4 font-normal outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                defaultValue={store?.slug ?? ""}
                id="slug"
                placeholder="minha-loja"
                type="text"
              />
            </label>
            <button
              className="h-12 cursor-pointer rounded-lg border border-zinc-300 bg-white px-4 text-sm font-bold text-zinc-900 transition hover:border-teal-700 hover:text-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200"
              type="button"
            >
              Copiar link
            </button>
          </div>

          <div className="mt-4 rounded-lg border border-zinc-200 bg-stone-50 p-3">
            <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
              Prévia do link
            </p>
            <p className="mt-1 break-all text-sm font-bold text-zinc-950">{publicLink}</p>
          </div>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-950">WhatsApp</h2>
          <p className="mt-1 text-sm leading-6 text-zinc-600">
            Esse número será usado nos botões de compra da vitrine.
          </p>

          <label className="mt-4 block text-sm font-bold text-zinc-800" htmlFor="whatsapp">
            Número do WhatsApp
            <input
              className="mt-2 h-12 w-full rounded-lg border border-zinc-300 px-4 font-normal outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
              defaultValue={store?.whatsapp ?? ""}
              id="whatsapp"
              placeholder="5581999999999"
              type="tel"
            />
          </label>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-950">Mensagem automática</h2>
          <p className="mt-1 text-sm leading-6 text-zinc-600">
            O trecho {"{{nome_do_produto}}"} será substituído automaticamente pelo produto
            clicado pelo cliente.
          </p>

          <label className="mt-4 block text-sm font-bold text-zinc-800" htmlFor="message">
            Texto padrão da mensagem
            <textarea
              className="mt-2 min-h-28 w-full rounded-lg border border-zinc-300 px-4 py-3 font-normal outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
              defaultValue={store?.whatsapp_message_template ?? defaultWhatsappMessage}
              id="message"
            />
          </label>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-950">Aparência da vitrine</h2>
          <p className="mt-1 text-sm leading-6 text-zinc-600">
            Estes campos já refletem o banco, mas upload e validações visuais ficam para
            uma etapa futura.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-bold text-zinc-800" htmlFor="primary-color">
              Cor principal
              <input
                className="mt-2 h-12 w-full rounded-lg border border-zinc-300 px-4 font-normal outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                defaultValue={store?.primary_color ?? ""}
                id="primary-color"
                placeholder="#0f766e"
                type="text"
              />
            </label>

            <label className="block text-sm font-bold text-zinc-800" htmlFor="status">
              Status da loja
              <input
                className="mt-2 h-12 w-full rounded-lg border border-zinc-300 px-4 font-normal outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                defaultValue={store?.is_active ? "Ativa" : "Inativa"}
                id="status"
                readOnly
                type="text"
              />
            </label>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-bold text-zinc-800" htmlFor="logo-url">
              URL da logo
              <input
                className="mt-2 h-12 w-full rounded-lg border border-zinc-300 px-4 font-normal outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                defaultValue={store?.logo_url ?? ""}
                id="logo-url"
                placeholder="https://..."
                type="url"
              />
            </label>

            <label className="block text-sm font-bold text-zinc-800" htmlFor="banner-url">
              URL do banner
              <input
                className="mt-2 h-12 w-full rounded-lg border border-zinc-300 px-4 font-normal outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                defaultValue={store?.banner_url ?? ""}
                id="banner-url"
                placeholder="https://..."
                type="url"
              />
            </label>
          </div>
        </section>

        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="mb-3 text-sm leading-6 text-zinc-600">
            Os campos acima são carregados do Supabase. O botão abaixo ainda é apenas
            visual; o salvamento real será implementado na próxima etapa.
          </p>
          <button
            className="h-11 w-full cursor-pointer rounded-lg bg-teal-800 px-4 text-sm font-bold text-white opacity-80 transition hover:bg-teal-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200 sm:w-auto"
            type="button"
          >
            Salvar alterações
          </button>
        </div>
      </form>
    </div>
  );
}
