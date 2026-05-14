import { store } from "../../lib/mock-data";

const whatsappMessage =
  "Olá! Tenho interesse no produto: {{nome_do_produto}}. Ainda está disponível?";

export default function DashboardSettingsPage() {
  const publicLink = `/loja/${store.slug}`;

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-semibold text-teal-700">Loja</p>
        <h1 className="text-3xl font-bold text-zinc-950">Configurações</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
          Ajuste como a loja aparece para os clientes. Nesta versão demo, as alterações
          ainda não são salvas de forma permanente.
        </p>
      </section>

      <form className="space-y-4">
        <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-950">Dados da loja</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-bold text-zinc-800" htmlFor="name">
              Nome da loja
              <input
                className="mt-2 h-12 w-full rounded-lg border border-zinc-300 px-4 font-normal outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                defaultValue={store.name}
                id="name"
                type="text"
              />
            </label>

            <label className="block text-sm font-bold text-zinc-800" htmlFor="main-category">
              Categoria principal do comércio
              <input
                className="mt-2 h-12 w-full rounded-lg border border-zinc-300 px-4 font-normal outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                defaultValue="Perfumaria"
                id="main-category"
                type="text"
              />
            </label>
          </div>

          <label className="mt-4 block text-sm font-bold text-zinc-800" htmlFor="description">
            Descrição curta
            <textarea
              className="mt-2 min-h-28 w-full rounded-lg border border-zinc-300 px-4 py-3 font-normal outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
              defaultValue={store.description}
              id="description"
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
                defaultValue={store.slug}
                id="slug"
                type="text"
              />
            </label>
            <button
              className="h-12 rounded-lg border border-zinc-300 bg-white px-4 text-sm font-bold text-zinc-900"
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
              defaultValue={store.whatsapp}
              id="whatsapp"
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
              defaultValue={whatsappMessage}
              id="message"
            />
          </label>
        </section>

        {/* <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-bold text-zinc-950">Aparência da vitrine</h2>
          <p className="mt-1 text-sm leading-6 text-zinc-600">
            Campos visuais para representar futuras opções de personalização.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-bold text-zinc-800" htmlFor="color">
              Nome da cor principal
              <input
                className="mt-2 h-12 w-full rounded-lg border border-zinc-300 px-4 font-normal outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                defaultValue="Verde elegante"
                id="color"
                type="text"
              />
            </label>

            <div className="rounded-lg border border-zinc-200 bg-stone-50 p-4">
              <p className="text-sm font-bold text-zinc-800">Logo da loja</p>
              <div className="mt-3 flex h-24 items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-white text-sm font-semibold text-zinc-500">
                Placeholder de logo
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-zinc-200 bg-stone-50 p-4">
            <p className="text-sm font-bold text-zinc-800">Banner da loja</p>
            <div className="mt-3 flex h-32 items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-[linear-gradient(135deg,#0f766e,#f59e0b)] text-sm font-bold text-white">
              Placeholder de banner
            </div>
          </div>
        </section> */}

        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="mb-3 text-sm leading-6 text-zinc-600">
            Nesta versão demo, o botão abaixo é apenas visual. A persistência real virá em
            uma etapa futura.
          </p>
          <button
            className="h-11 w-full rounded-lg bg-teal-800 px-4 text-sm font-bold text-white sm:w-auto"
            type="button"
          >
            Salvar alterações
          </button>
        </div>
      </form>
    </div>
  );
}
