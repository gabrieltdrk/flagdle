import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { categoryCards } from "../../utils/category-cards";
import { formatArea, formatDateLabel, formatPopulation } from "../../utils/formatters";
import { loadDailyState, saveDailyState } from "../../services/storage-service";
import {
  getCountryByGuess,
  getDailyTarget,
  getDirectionText,
  getGuessFeedback,
  getSuggestions,
  getTodayKey,
  getToneClasses,
  maxGuesses,
} from "./daily-utils";

export function DailyGame() {
  const dateKey = getTodayKey();
  const target = useMemo(() => getDailyTarget(dateKey), [dateKey]);
  const [gameState, setGameState] = useState(() => loadDailyState(dateKey));
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setGameState(loadDailyState(dateKey));
  }, [dateKey]);

  useEffect(() => {
    saveDailyState(gameState);
  }, [gameState]);

  const guessedCodes = new Set(gameState.guesses.map((guess) => guess.code));
  const suggestions = getSuggestions(query, guessedCodes);
  const isFinished = gameState.won || gameState.guesses.length >= maxGuesses;

  function submitGuess(rawValue: string) {
    if (isFinished) {
      return;
    }

    const guessCountry = getCountryByGuess(rawValue);

    if (!guessCountry) {
      setMessage("Nao encontrei esse pais no banco inicial. Escolha uma opcao valida.");
      return;
    }

    if (guessedCodes.has(guessCountry.code)) {
      setMessage("Esse pais ja foi usado. Tente outro palpite.");
      return;
    }

    setGameState({
      dateKey,
      guesses: [guessCountry, ...gameState.guesses],
      won: guessCountry.code === target.code,
    });
    setQuery("");
    setMessage("");
  }

  return (
    <>
      <section className="mb-5 grid gap-4 rounded-[2rem] border border-sky-300/70 bg-slate-50/78 p-5 shadow-2xl shadow-sky-900/10 backdrop-blur lg:grid-cols-[220px_1fr] lg:p-6">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.35em] text-amber-500">
            Desafio diario
          </p>
          <h1 className="text-3xl font-black tracking-tight text-slate-800 md:text-5xl">
            {formatDateLabel(dateKey)}
          </h1>
          <p className="mt-3 text-slate-600">
            Tente descobrir o pais secreto em ate {maxGuesses} palpites.
          </p>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        <article className="rounded-[2rem] border border-sky-300/70 bg-slate-50/78 p-5 shadow-2xl shadow-sky-900/10 backdrop-blur lg:p-6">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.35em] text-amber-500">
                Modo /daily
              </p>
              <h2 className="text-2xl font-black tracking-tight text-slate-800">Pais secreto de hoje</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
              {gameState.guesses.length}/{maxGuesses}
            </span>
          </div>

          <div className="mb-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {categoryCards.map((card) => (
              <article
                key={card.label}
                className="rounded-[1.4rem] border border-sky-200 bg-white/72 p-4"
              >
                <strong className="block text-sm text-slate-800">{card.label}</strong>
                <p className="mt-2 text-sm leading-6 text-slate-600">{card.detail}</p>
              </article>
            ))}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              submitGuess(query);
            }}
            className="mb-6"
          >
            <label htmlFor="country-input" className="mb-3 block text-sm font-bold text-slate-700">
              Seu palpite
            </label>
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <input
                  id="country-input"
                  type="text"
                  value={query}
                  disabled={isFinished}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setMessage("");
                  }}
                  placeholder="Digite um pais"
                  className="min-h-14 w-full rounded-3xl border border-sky-200 bg-white/92 px-5 text-base text-slate-800 outline-none placeholder:text-slate-400 focus:border-sky-400/60"
                />
                {suggestions.length > 0 ? (
                  <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-10 grid gap-2">
                    {suggestions.map((country) => (
                      <button
                        key={country.code}
                        type="button"
                        onClick={() => {
                          setQuery(country.name);
                          setMessage("");
                        }}
                        className="flex items-center gap-3 rounded-2xl border border-sky-200 bg-slate-50 px-4 py-3 text-left text-sm text-slate-700"
                      >
                        <span className="text-xl">{country.flag}</span>
                        <span>{country.name}</span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
              <button
                type="submit"
                disabled={isFinished}
                className="inline-flex min-h-14 items-center justify-center rounded-full bg-gradient-to-r from-amber-300 to-orange-400 px-6 text-sm font-extrabold text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Enviar
              </button>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Digite o nome do pais. Tambem aceitamos algumas variantes como "EUA",
              "UK" e "Holanda".
            </p>
            <p className="mt-2 min-h-6 text-sm text-amber-200">{message}</p>
          </form>

          <div className="space-y-3">
            <div className="hidden grid-cols-[1.2fr_repeat(5,minmax(0,1fr))] gap-3 rounded-[1.4rem] border border-sky-200 bg-white/70 p-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-500 xl:grid">
              <span>Pais</span>
              <span>Continente</span>
              <span>Cores</span>
              <span>Populacao</span>
              <span>Area</span>
              <span>Hemisferio</span>
            </div>

            {gameState.guesses.length === 0 ? (
              <div className="rounded-[1.4rem] border border-sky-200 bg-white/72 p-5">
                <strong className="block text-slate-800">Nenhum palpite ainda.</strong>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Comece por um pais que te ajude a testar continentes e combinacoes
                  de cores.
                </p>
              </div>
            ) : (
              gameState.guesses.map((guess) => {
                const feedback = getGuessFeedback(guess, target);

                return (
                  <article
                    key={guess.code}
                    className="grid gap-3 rounded-[1.5rem] border border-sky-200 bg-white/68 p-3 xl:grid-cols-[1.2fr_repeat(5,minmax(0,1fr))]"
                  >
                    <div className="rounded-3xl border border-sky-200 bg-white/85 p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{guess.flag}</span>
                        <div>
                          <strong className="block text-slate-800">{guess.name}</strong>
                          <p className="text-sm text-slate-500">{guess.code}</p>
                        </div>
                      </div>
                    </div>

                    <ToneCell status={feedback.continent}>
                      <strong className="block text-slate-800">{guess.continent}</strong>
                    </ToneCell>

                    <ToneCell status={feedback.colors.status}>
                      <strong className="block text-slate-800">{guess.colors.join(", ")}</strong>
                      <p className="mt-2 text-sm text-slate-600">
                        {feedback.colors.status === "exact"
                          ? "Paleta completa."
                          : feedback.colors.status === "close"
                            ? `Em comum: ${feedback.colors.shared.join(", ")}`
                            : "Sem cores em comum."}
                      </p>
                    </ToneCell>

                    <ToneCell status={feedback.population.status}>
                      <strong className="block text-slate-800">
                        {formatPopulation(guess.population)}
                      </strong>
                      <p className="mt-2 text-sm text-slate-600">
                        {getDirectionText(feedback.population.direction)}
                      </p>
                    </ToneCell>

                    <ToneCell status={feedback.area.status}>
                      <strong className="block text-slate-800">
                        {formatArea(guess.area)} km2
                      </strong>
                      <p className="mt-2 text-sm text-slate-600">
                        {getDirectionText(feedback.area.direction)}
                      </p>
                    </ToneCell>

                    <ToneCell status={feedback.hemisphere}>
                      <strong className="block text-slate-800">{guess.hemisphere}</strong>
                    </ToneCell>
                  </article>
                );
              })
            )}
          </div>
        </article>

        <aside className="rounded-[2rem] border border-sky-300/70 bg-slate-50/78 p-5 shadow-2xl shadow-sky-900/10 backdrop-blur lg:p-6">
          <div className="mb-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.35em] text-amber-500">
              Regras rapidas
            </p>
            <h2 className="text-2xl font-black tracking-tight text-slate-800">Como ler as pistas</h2>
          </div>

          <ul className="space-y-3 text-sm leading-6 text-slate-600">
            <LegendItem color="bg-emerald-400" text="Verde: combinacao exata." />
            <LegendItem
              color="bg-amber-300"
              text="Dourado: esta perto ou compartilha parte da pista."
            />
            <LegendItem color="bg-slate-500" text="Escuro: nao corresponde ao alvo." />
          </ul>

          <div className="mt-5 rounded-[1.4rem] border border-sky-200 bg-white/72 p-5">
            {gameState.won ? (
              <>
                <p className="text-base font-bold text-slate-800">Voce acertou.</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  O pais secreto de hoje era <strong>{target.name}</strong>. Volte
                  amanha para um novo desafio.
                </p>
              </>
            ) : gameState.guesses.length >= maxGuesses ? (
              <>
                <p className="text-base font-bold text-slate-800">Tentativas encerradas.</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  O pais secreto de hoje era <strong>{target.name}</strong>. Amanha
                  tem outro.
                </p>
              </>
            ) : (
              <>
                <p className="text-base font-bold text-slate-800">Jogo em andamento.</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Restam <strong>{maxGuesses - gameState.guesses.length}</strong> palpites
                  para descobrir o pais.
                </p>
              </>
            )}
          </div>

          <div className={`mt-5 ${isFinished ? "opacity-100" : "opacity-70"}`}>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.35em] text-amber-500">
              Resposta
            </p>
            <div className="flex items-center gap-4 rounded-[1.4rem] border border-sky-200 bg-white/72 p-5">
              <span className="text-4xl">{isFinished ? target.flag : "🏳️"}</span>
              <div>
                <strong className="block text-slate-800">
                  {isFinished ? target.name : "Pais oculto"}
                </strong>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {isFinished
                    ? `${target.continent} | ${formatPopulation(target.population)} habitantes`
                    : "A resposta aparece quando voce vence ou esgota as tentativas."}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}

type ToneCellProps = {
  status: "exact" | "close" | "miss";
  children: ReactNode;
};

function ToneCell({ status, children }: ToneCellProps) {
  return <div className={`rounded-3xl border p-4 ${getToneClasses(status)}`}>{children}</div>;
}

type LegendItemProps = {
  color: string;
  text: string;
};

function LegendItem({ color, text }: LegendItemProps) {
  return (
    <li className="flex items-center gap-3">
      <span className={`h-3.5 w-3.5 rounded-full ${color}`} />
      <span>{text}</span>
    </li>
  );
}
