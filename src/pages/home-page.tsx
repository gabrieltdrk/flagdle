import { NavLink } from "../components/nav-link";
import { SiteFooter } from "../layouts/site-footer";
import { categoryCards } from "../utils/category-cards";

type HomePageProps = {
  onNavigate: (path: string) => void;
};

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 md:px-8 lg:px-10">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-52 rounded-t-[4rem] bg-gradient-to-t from-lime-900/80 via-green-900/35 to-transparent" />
      <div className="pointer-events-none absolute inset-x-10 bottom-14 h-24 rounded-full bg-lime-400/10 blur-3xl" />

      <header className="relative z-10 flex flex-col items-center pt-2 text-center">
        <p className="mb-2 text-xs font-black uppercase tracking-[0.45em] text-sky-100/80">
          Guess the Flag
        </p>
        <h1 className="logo-title text-6xl font-black tracking-tight text-amber-300 md:text-8xl">
          Flagdle
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-100/85 md:text-base">
          Escolhe um modo de jogo e tenta descobrir a bandeira certa antes das
          tentativas acabarem.
        </p>
      </header>

      <section className="relative z-10 flex flex-1 items-center justify-center py-10 md:py-14">
        <div className="w-full max-w-4xl rounded-[2.25rem] border border-white/15 bg-slate-900/55 p-5 shadow-2xl shadow-black/30 backdrop-blur md:p-7">
          <div className="mb-5 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.38em] text-amber-200/90">
              Modos disponiveis
            </p>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-50 md:text-4xl">
              Escolhe como quer jogar
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
            <NavLink
              href="/daily"
              onNavigate={onNavigate}
              className="group rounded-[2rem] border border-amber-200/40 bg-gradient-to-br from-slate-800/95 via-sky-950/90 to-slate-900/95 p-6 shadow-xl shadow-sky-950/40"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex rounded-full border border-emerald-300/30 bg-emerald-300/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-emerald-200">
                    Disponivel
                  </span>
                  <h3 className="mt-4 text-3xl font-black tracking-tight text-white">
                    Diario
                  </h3>
                </div>
                <div className="rounded-2xl border border-amber-200/30 bg-amber-300/15 px-3 py-2 text-2xl text-amber-200 transition group-hover:scale-105">
                  {"->"}
                </div>
              </div>
              <p className="mt-5 max-w-xl text-sm leading-6 text-slate-200/85 md:text-base">
                Um pais por dia. Usa continente, cores da bandeira, hemisferio,
                populacao e area territorial para chegar na resposta.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {categoryCards.slice(0, 3).map((card) => (
                  <span
                    key={card.label}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-100/80"
                  >
                    {card.label}
                  </span>
                ))}
              </div>
            </NavLink>

            <div className="rounded-[2rem] border border-white/12 bg-slate-950/65 p-6">
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-sky-100/75">
                Em breve
              </p>
              <h3 className="mt-3 text-2xl font-black text-slate-50">Mais modos</h3>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                Essa area pode receber desafios tematicos, modo infinito, bandeira
                parcial, estatisticas e streak.
              </p>
              <div className="mt-6 space-y-3">
                <div className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-slate-300">
                  Infinito
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-slate-300">
                  Bandeira parcial
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-slate-300">
                  Ranked semanal
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter onNavigate={onNavigate} />
    </main>
  );
}
