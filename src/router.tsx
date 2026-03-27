import type { ReactElement } from "react";
import { DailyPage } from "./pages/daily-page";
import { HomePage } from "./pages/home-page";
import { PrivacyPage } from "./pages/privacy-page";

type RouterProps = {
  pathname: string;
  onNavigate: (path: string) => void;
};

const routes: Record<string, (onNavigate: RouterProps["onNavigate"]) => ReactElement> = {
  "/": (onNavigate) => <HomePage onNavigate={onNavigate} />,
  "/daily": (onNavigate) => <DailyPage onNavigate={onNavigate} />,
  "/privacy": (onNavigate) => <PrivacyPage onNavigate={onNavigate} />,
};

export function Router({ pathname, onNavigate }: RouterProps) {
  const renderPage = routes[pathname] ?? routes["/"];

  return renderPage(onNavigate);
}
