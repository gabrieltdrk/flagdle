import { Header } from "../components/header";
import { PolicySection } from "../components/policy-section";
import { SiteFooter } from "../layouts/site-footer";

type PrivacyPageProps = {
  onNavigate: (path: string) => void;
};

export function PrivacyPage({ onNavigate }: PrivacyPageProps) {
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-5 py-6 md:px-8 lg:px-10">
      <Header onNavigate={onNavigate} title="Politica de privacidade" />

      <section className="mt-5 rounded-[2rem] border border-sky-300/70 bg-slate-50/78 p-6 shadow-2xl shadow-sky-900/10 backdrop-blur md:p-8">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-amber-500">
            Privacy
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
