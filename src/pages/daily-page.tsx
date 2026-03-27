import { NavLink } from "../components/nav-link";
import { DailyGame } from "../features/daily/daily-game";

type DailyPageProps = {
  onNavigate: (path: string) => void;
};

export function DailyPage({ onNavigate }: DailyPageProps) {
  return (
    <main className="mx-auto max-w-7xl px-5 py-6 md:px-8 lg:px-10 lg:py-8">
      <section className="mb-5 flex items-center rounded-[2rem] border border-sky-300/70 bg-slate-50/78 p-5 shadow-2xl shadow-sky-900/10 backdrop-blur lg:p-6">
        <NavLink
          href="/"
          onNavigate={onNavigate}
          className="inline-flex w-fit items-center gap-3 text-base font-bold text-slate-800"
        >
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-r from-sky-400 to-orange-400 text-slate-950">
            F
          </span>
          <span>Flagdle</span>
        </NavLink>
      </section>

      <DailyGame />
    </main>
  );
}
