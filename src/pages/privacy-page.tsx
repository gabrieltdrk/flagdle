import { NavLink } from "../components/nav-link";
import { PolicySection } from "../components/policy-section";
import { SiteFooter } from "../layouts/site-footer";

type PrivacyPageProps = {
  onNavigate: (path: string) => void;
};

export function PrivacyPage({ onNavigate }: PrivacyPageProps) {
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-5 py-6 md:px-8 lg:px-10">
      <section className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/30 backdrop-blur md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <NavLink
            href="/"
            onNavigate={onNavigate}
            className="inline-flex items-center gap-3 text-sm font-bold text-slate-100"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-r from-sky-400 to-orange-400 text-slate-950">
              F
            </span>
            <span>Flagdle</span>
          </NavLink>
          <NavLink
            href="/daily"
            onNavigate={onNavigate}
            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-slate-100"
          >
            Ir para o diario
          </NavLink>
        </div>

        <div className="mt-8 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-amber-300">
            Privacy
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-50 md:text-5xl">
            Politica de privacidade
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-300 md:text-base">
            Esta politica explica, de forma simples, como o Flagdle trata os dados de
            quem acessa o jogo.
          </p>
        </div>

        <div className="mt-8 grid gap-4">
          <PolicySection
            title="1. Dados coletados"
            text="Nesta versao atual, o jogo nao exige cadastro e nao coleta dados pessoais enviados por formulario. O progresso diario e armazenado localmente no navegador para manter suas tentativas entre visitas."
          />
          <PolicySection
            title="2. Armazenamento local"
            text="Usamos o armazenamento local do navegador para salvar informacoes como palpites e status do desafio do dia. Esses dados ficam no proprio dispositivo do usuario."
          />
          <PolicySection
            title="3. Cookies e analytics"
            text="No momento, esta versao nao depende de uma conta de usuario para funcionar. Se ferramentas de analytics, anuncios ou integracoes externas forem adicionadas no futuro, esta pagina sera atualizada."
          />
          <PolicySection
            title="4. Contato e alteracoes"
            text="Se a aplicacao evoluir para usar backend, login, ranking online ou outro tipo de telemetria, a politica sera revisada para refletir exatamente o que mudou."
          />
        </div>
      </section>

      <SiteFooter onNavigate={onNavigate} compact />
    </main>
  );
}
