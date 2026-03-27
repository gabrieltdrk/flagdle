import { NavLink } from "../components/nav-link";

type SiteFooterProps = {
  compact?: boolean;
  onNavigate: (path: string) => void;
};

export function SiteFooter({ compact = false, onNavigate }: SiteFooterProps) {
  return (
    <footer
      className={`relative z-10 mt-auto flex flex-col items-center justify-center gap-3 pb-2 text-center ${
        compact ? "pt-8" : "pt-4"
      }`}
    >
      <NavLink
        href="/privacy"
        onNavigate={onNavigate}
        className="rounded-full border border-white/15 bg-slate-950/55 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-slate-100"
      >
        Politica de privacidade
      </NavLink>
      <p className="max-w-xl text-xs leading-6 text-slate-200/70">
        Flagdle e um projeto independente inspirado em jogos diarios de adivinhacao.
      </p>
    </footer>
  );
}
