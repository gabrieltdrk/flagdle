import type { PropsWithChildren } from "react";

type NavLinkProps = PropsWithChildren<{
  href: string;
  className: string;
  onNavigate: (path: string) => void;
}>;

export function NavLink({ href, className, onNavigate, children }: NavLinkProps) {
  return (
    <a
      href={href}
      className={className}
      onClick={(event) => {
        event.preventDefault();
        onNavigate(href);
      }}
    >
      {children}
    </a>
  );
}
