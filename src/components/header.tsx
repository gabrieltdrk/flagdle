import { NavLink } from "./nav-link";

type HeaderProps = {
  onNavigate: (path: string) => void;
};

export function Header({ onNavigate }: HeaderProps) {
  return (
    <header className="relative z-10 bg-transparent p-5 lg:p-6">
      <div className="flex items-center justify-center gap-4 md:gap-9">
        <span className="text-4xl leading-none">⚙</span>

        <NavLink href="/" onNavigate={onNavigate} className="inline-flex items-center gap-3 font-bold select-none">
          <h1 className="logo-title text-5xl font-black tracking-tight text-blue-400 md:text-7xl transition-all hover:scale-105">
            Flagdle
          </h1>
        </NavLink>

        <span className="text-xs font-black uppercase tracking-[0.18em]">
          Idioma
        </span>
      </div>
    </header>
  );
}