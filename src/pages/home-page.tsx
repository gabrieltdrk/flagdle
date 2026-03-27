import { NavLink } from "../components/nav-link";
import { SiteFooter } from "../layouts/site-footer";
import { categoryCards } from "../utils/category-cards";

type HomePageProps = {
  onNavigate: (path: string) => void;
};

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 md:px-8 lg:px-10">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-52 rounded-t-[4rem] bg-gradient-to-t from-sky-300/50 via-sky-100/30 to-transparent" />
      <div className="pointer-events-none absolute inset-x-10 bottom-14 h-24 rounded-full bg-sky-200/35 blur-3xl" />

      <header className="relative z-10 flex flex-col items-center pt-2 text-center">
        <h1 className="logo-title text-6xl font-black tracking-tight text-amber-400 md:text-8xl select-none">
          Flagdle
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-700/90 md:text-base">
          Escolhe um modo de jogo e tenta descobrir a bandeira certa antes das
          tentativas acabarem.
        </p>
      </header>

      <section className="relative z-10 flex flex-1 items-center justify-center py-10 md:py-14">
        <div className="w-full max-w-4xl rounded-[2.25rem] border border-sky-300/70 bg-slate-50/78 p-5 shadow-2xl shadow-sky-900/10 backdrop-blur md:p-7">
          <div className="mb-5 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.38em] text-amber-500">
              Modos disponiveis
            </p>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-800 md:text-4xl">
              Escolhe como quer jogar
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
            <NavLink
              href="/daily"
              onNavigate={onNavigate}
              className="group rounded-[2rem] border border-sky-300/60 bg-gradient-to-br from-slate-100 via-sky-100/90 to-slate-50 p-6 shadow-xl shadow-sky-900/10"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex rounded-full border border-emerald-400/25 bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-emerald-700">
                    Disponivel
                  </span>
                  <h3 className="mt-4 text-3xl font-black tracking-tight text-slate-800">
                    Diario
                  </h3>
                </div>
                <div className="rounded-2xl border border-amber-300/40 bg-amber-100 px-3 py-2 text-2xl text-amber-600 transition group-hover:scale-105">
                  {"->"}
                </div>
              </div>
              <p className="mt-5 max-w-xl text-sm leading-6 text-slate-600 md:text-base">
                Um pais por dia. Usa continente, cores da bandeira, hemisferio,
                populacao e area territorial para chegar na resposta.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {categoryCards.slice(0, 3).map((card) => (
                  <span
                    key={card.label}
                    className="rounded-2xl border border-sky-200 bg-white/75 px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-600"
                  >
                    {card.label}
                  </span>
                ))}
              </div>
            </NavLink>

            <div className="rounded-[2rem] border border-sky-200/80 bg-slate-100/75 p-6">
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-sky-600/80">
                Em breve
              </p>
              <h3 className="mt-3 text-2xl font-black text-slate-800">Mais modos</h3>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Essa area pode receber desafios tematicos, modo infinito, bandeira
                parcial, estatisticas e streak.
              </p>
              <div className="mt-6 space-y-3">
                <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-600">
                  Infinito
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-600">
                  Bandeira parcial
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-600">
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
