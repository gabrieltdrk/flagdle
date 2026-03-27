import { useEffect, useState } from "react";
import { Router } from "./router";

export default function App() {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    function handlePopState() {
      setPathname(window.location.pathname);
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function navigate(path: string) {
    if (path === pathname) {
      return;
    }

    window.history.pushState({}, "", path);
    setPathname(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden text-slate-800">
      <div className="bg-grid pointer-events-none fixed inset-0 opacity-80" />
      <div className="pointer-events-none fixed -left-16 -top-20 h-80 w-80 rounded-full bg-sky-300/35 blur-3xl" />
      <div className="pointer-events-none fixed -right-20 top-28 h-80 w-80 rounded-full bg-amber-200/45 blur-3xl" />
      <Router pathname={pathname} onNavigate={navigate} />
    </div>
  );
}
