import { Header } from "../components/header";
import { DailyGame } from "../features/daily/daily-game";

type DailyPageProps = {
  onNavigate: (path: string) => void;
};

export function DailyPage({ onNavigate }: DailyPageProps) {
  return (
    <main className="mx-auto max-w-7xl px-5 py-6 md:px-8 lg:px-10 lg:py-8">
      <Header onNavigate={onNavigate} title="Desafio diario" />
      <DailyGame />
    </main>
  );
}
