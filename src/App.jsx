import { useEffect, useState } from "react";
import { countries } from "./data/countries.js";

const STORAGE_KEY = "flagdle:daily-state";
const MAX_GUESSES = 8;

const categoryCards = [
  {
    label: "Cor da bandeira",
    detail: "Combina totalmente ou parcialmente com o pais secreto.",
  },
  {
    label: "Continente",
    detail: "Acerto exato quando o continente bate com o alvo.",
  },
  {
    label: "Populacao",
    detail: "Mostra se voce precisa subir ou descer o numero.",
  },
  {
    label: "Area territorial",
    detail: "Tambem usa proximidade e direcao para guiar o proximo palpite.",
  },
  {
    label: "Hemisferio",
    detail: "Ajuda a reduzir o mapa rapidamente.",
  },
];

function normalizeText(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getPuzzleIndex(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const startUtc = Date.UTC(2026, 0, 1);
  const todayUtc = Date.UTC(year, month - 1, day);
  const diff = Math.floor((todayUtc - startUtc) / 86400000);
  return ((diff % countries.length) + countries.length) % countries.length;
}

function getDailyTarget(dateKey) {
  return countries[getPuzzleIndex(dateKey)];
}

function loadDailyState(dateKey) {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { dateKey, guesses: [], won: false };
  }

  try {
    const parsed = JSON.parse(raw);
    if (parsed.dateKey !== dateKey) {
      return { dateKey, guesses: [], won: false };
    }

    return {
      dateKey,
      guesses: Array.isArray(parsed.guesses) ? parsed.guesses : [],
      won: Boolean(parsed.won),
    };
  } catch {
    return { dateKey, guesses: [], won: false };
  }
}

function saveDailyState(state) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getCountryByGuess(input) {
  const normalized = normalizeText(input);
  return countries.find((country) => {
    if (normalizeText(country.name) === normalized) {
      return true;
    }

    return country.aliases.some((alias) => normalizeText(alias) === normalized);
  });
}

function getSuggestions(query, guessedCodes) {
  const normalized = normalizeText(query);
  if (!normalized) {
    return [];
  }

  return countries
    .filter((country) => {
      if (guessedCodes.has(country.code)) {
        return false;
      }

      return [country.name, ...country.aliases]
        .map(normalizeText)
        .some((value) => value.includes(normalized));
    })
    .slice(0, 8);
}

function sortColors(colors) {
  return [...colors].sort().join("|");
}

function compareNumeric(guessValue, targetValue) {
  const ratio = Math.abs(guessValue - targetValue) / targetValue;
  const direction =
    guessValue < targetValue ? "up" : guessValue > targetValue ? "down" : "equal";

  if (guessValue === targetValue) {
    return { status: "exact", direction };
  }

  if (ratio <= 0.12) {
    return { status: "close", direction };
  }

  return { status: "miss", direction };
}

function compareColors(guessColors, targetColors) {
  const guessSet = new Set(guessColors);
  const shared = targetColors.filter((color) => guessSet.has(color));

  if (sortColors(guessColors) === sortColors(targetColors)) {
    return { status: "exact", shared };
  }

  if (shared.length > 0) {
    return { status: "close", shared };
  }

  return { status: "miss", shared };
}

function getGuessFeedback(guessCountry, targetCountry) {
  return {
    continent: guessCountry.continent === targetCountry.continent ? "exact" : "miss",
    hemisphere: guessCountry.hemisphere === targetCountry.hemisphere ? "exact" : "miss",
    colors: compareColors(guessCountry.colors, targetCountry.colors),
    population: compareNumeric(guessCountry.population, targetCountry.population),
    area: compareNumeric(guessCountry.area, targetCountry.area),
  };
}

function formatPopulation(value) {
  return new Intl.NumberFormat("pt-BR", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatArea(value) {
  return new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDateLabel(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "full",
  }).format(new Date(year, month - 1, day));
}

function getDirectionText(direction) {
  if (direction === "up") {
    return "O alvo e maior";
  }

  if (direction === "down") {
    return "O alvo e menor";
  }

  return "Valor exato";
}

function getToneClasses(status) {
  if (status === "exact") {
    return "border-emerald-400/40 bg-emerald-400/15";
  }

  if (status === "close") {
    return "border-amber-300/40 bg-amber-300/15";
  }

  return "border-slate-500/30 bg-slate-900/80";
}

function NavLink({ href, onNavigate, className, children }) {
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

function App() {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    function handlePopState() {
      setPathname(window.location.pathname);
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function navigate(nextPath) {
    if (nextPath === pathname) {
      return;
    }

    window.history.pushState({}, "", nextPath);
    setPathname(nextPath);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const page =
    pathname === "/daily" ? (
      <DailyPage onNavigate={navigate} />
    ) : pathname === "/privacy" ? (
      <PrivacyPage onNavigate={navigate} />
    ) : (
      <HomePage onNavigate={navigate} />
    );

  return (
    <div className="relative min-h-screen overflow-x-hidden text-slate-50">
      <div className="bg-grid pointer-events-none fixed inset-0 opacity-80" />
      <div className="pointer-events-none fixed -left-16 -top-20 h-80 w-80 rounded-full bg-sky-500/30 blur-3xl" />
      <div className="pointer-events-none fixed -right-20 top-28 h-80 w-80 rounded-full bg-orange-400/20 blur-3xl" />
      {page}
    </div>
  );
}

function HomePage({ onNavigate }) {
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
              <h3 className="mt-3 text-2xl font-black text-slate-50">
                Mais modos
              </h3>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                Essa area pode receber desafios tematicos, modo infinito,
                bandeira parcial, estatisticas e streak.
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

      <FooterNav onNavigate={onNavigate} />
    </main>
  );
}

function PrivacyPage({ onNavigate }) {
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-5 py-6 md:px-8 lg:px-10">
      <section className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/30 backdrop-blur md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <NavLink
            href="/"
            onNavigate={onNavigate}
            className="inline-flex items-center gap-3 text-sm font-bold text-slate-100"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-r from-sky-400 to-orange-400 text-slate-950">
              F
            </span>
            <span>Flagdle</span>
          </NavLink>
          <NavLink
            href="/daily"
            onNavigate={onNavigate}
            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-slate-100"
          >
            Ir para o diario
          </NavLink>
        </div>

        <div className="mt-8 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-amber-300">
            Privacy
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-50 md:text-5xl">
            Politica de privacidade
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-300 md:text-base">
            Esta politica explica, de forma simples, como o Flagdle trata os dados
            de quem acessa o jogo.
          </p>
        </div>

        <div className="mt-8 grid gap-4">
          <PolicySection
            title="1. Dados coletados"
            text="Nesta versao atual, o jogo nao exige cadastro e nao coleta dados pessoais enviados por formulario. O progresso diario e armazenado localmente no navegador para manter suas tentativas entre visitas."
          />
          <PolicySection
            title="2. Armazenamento local"
            text="Usamos o armazenamento local do navegador para salvar informacoes como palpites e status do desafio do dia. Esses dados ficam no proprio dispositivo do usuario."
          />
          <PolicySection
            title="3. Cookies e analytics"
            text="No momento, esta versao nao depende de uma conta de usuario para funcionar. Se ferramentas de analytics, anuncios ou integracoes externas forem adicionadas no futuro, esta pagina sera atualizada."
          />
          <PolicySection
            title="4. Contato e alteracoes"
            text="Se a aplicacao evoluir para usar backend, login, ranking online ou outro tipo de telemetria, a politica sera revisada para refletir exatamente o que mudou."
          />
        </div>
      </section>

      <FooterNav onNavigate={onNavigate} compact />
    </main>
  );
}

function DailyPage({ onNavigate }) {
  const dateKey = getTodayKey();
  const target = getDailyTarget(dateKey);
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
  const isFinished = gameState.won || gameState.guesses.length >= MAX_GUESSES;

  function submitGuess(rawValue) {
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

    const nextState = {
      dateKey,
      guesses: [guessCountry, ...gameState.guesses],
      won: guessCountry.code === target.code,
    };

    setGameState(nextState);
    setQuery("");
    setMessage("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    submitGuess(query);
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-6 md:px-8 lg:px-10 lg:py-8">
      <section className="mb-5 grid gap-4 rounded-[2rem] border border-white/10 bg-slate-950/70 p-5 shadow-2xl shadow-black/30 backdrop-blur lg:grid-cols-[220px_1fr] lg:p-6">
        <NavLink
          href="/"
          onNavigate={onNavigate}
          className="inline-flex w-fit items-center gap-3 text-base font-bold text-slate-50"
        >
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-r from-sky-400 to-orange-400 text-slate-950">
            F
          </span>
          <span>Flagdle</span>
        </NavLink>
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.35em] text-amber-300">
            Desafio diario
          </p>
          <h1 className="text-3xl font-black tracking-tight md:text-5xl">
            {formatDateLabel(dateKey)}
          </h1>
          <p className="mt-3 text-slate-300">
            Tente descobrir o pais secreto em ate {MAX_GUESSES} palpites.
          </p>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        <article className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-5 shadow-2xl shadow-black/30 backdrop-blur lg:p-6">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.35em] text-amber-300">
                Modo /daily
              </p>
              <h2 className="text-2xl font-black tracking-tight">Pais secreto de hoje</h2>
            </div>
            <span className="rounded-full bg-white/8 px-4 py-2 text-sm font-bold text-slate-200">
              {gameState.guesses.length}/{MAX_GUESSES}
            </span>
          </div>

          <div className="mb-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {categoryCards.map((card) => (
              <article
                key={card.label}
                className="rounded-[1.4rem] border border-white/8 bg-white/5 p-4"
              >
                <strong className="block text-sm text-slate-50">{card.label}</strong>
                <p className="mt-2 text-sm leading-6 text-slate-300">{card.detail}</p>
              </article>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mb-6">
            <label
              htmlFor="country-input"
              className="mb-3 block text-sm font-bold text-slate-100"
            >
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
                  className="min-h-14 w-full rounded-3xl border border-white/10 bg-slate-950/90 px-5 text-base text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-400/60"
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
                        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-left text-sm text-slate-100"
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
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Digite o nome do pais. Tambem aceitamos algumas variantes como
              "EUA", "UK" e "Holanda".
            </p>
            <p className="mt-2 min-h-6 text-sm text-amber-200">{message}</p>
          </form>

          <div className="space-y-3">
            <div className="hidden grid-cols-[1.2fr_repeat(5,minmax(0,1fr))] gap-3 rounded-[1.4rem] border border-white/8 bg-white/4 p-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-400 xl:grid">
              <span>Pais</span>
              <span>Continente</span>
              <span>Cores</span>
              <span>Populacao</span>
              <span>Area</span>
              <span>Hemisferio</span>
            </div>

            {gameState.guesses.length === 0 ? (
              <div className="rounded-[1.4rem] border border-white/8 bg-white/5 p-5">
                <strong className="block text-slate-50">Nenhum palpite ainda.</strong>
                <p className="mt-2 text-sm leading-6 text-slate-300">
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
                    className="grid gap-3 rounded-[1.5rem] border border-white/8 bg-white/4 p-3 xl:grid-cols-[1.2fr_repeat(5,minmax(0,1fr))]"
                  >
                    <div className="rounded-3xl border border-white/8 bg-white/4 p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{guess.flag}</span>
                        <div>
                          <strong className="block text-slate-50">{guess.name}</strong>
                          <p className="text-sm text-slate-400">{guess.code}</p>
                        </div>
                      </div>
                    </div>

                    <Cell status={feedback.continent}>
                      <strong className="block text-slate-50">{guess.continent}</strong>
                    </Cell>

                    <Cell status={feedback.colors.status}>
                      <strong className="block text-slate-50">
                        {guess.colors.join(", ")}
                      </strong>
                      <p className="mt-2 text-sm text-slate-300">
                        {feedback.colors.status === "exact"
                          ? "Paleta completa."
                          : feedback.colors.status === "close"
                            ? `Em comum: ${feedback.colors.shared.join(", ")}`
                            : "Sem cores em comum."}
                      </p>
                    </Cell>

                    <Cell status={feedback.population.status}>
                      <strong className="block text-slate-50">
                        {formatPopulation(guess.population)}
                      </strong>
                      <p className="mt-2 text-sm text-slate-300">
                        {getDirectionText(feedback.population.direction)}
                      </p>
                    </Cell>

                    <Cell status={feedback.area.status}>
                      <strong className="block text-slate-50">
                        {formatArea(guess.area)} km2
                      </strong>
                      <p className="mt-2 text-sm text-slate-300">
                        {getDirectionText(feedback.area.direction)}
                      </p>
                    </Cell>

                    <Cell status={feedback.hemisphere}>
                      <strong className="block text-slate-50">{guess.hemisphere}</strong>
                    </Cell>
                  </article>
                );
              })
            )}
          </div>
        </article>

        <aside className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-5 shadow-2xl shadow-black/30 backdrop-blur lg:p-6">
          <div className="mb-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.35em] text-amber-300">
              Regras rapidas
            </p>
            <h2 className="text-2xl font-black tracking-tight">Como ler as pistas</h2>
          </div>

          <ul className="space-y-3 text-sm leading-6 text-slate-300">
            <LegendItem color="bg-emerald-400" text="Verde: combinacao exata." />
            <LegendItem
              color="bg-amber-300"
              text="Dourado: esta perto ou compartilha parte da pista."
            />
            <LegendItem color="bg-slate-500" text="Escuro: nao corresponde ao alvo." />
          </ul>

          <div className="mt-5 rounded-[1.4rem] border border-white/8 bg-white/5 p-5">
            {gameState.won ? (
              <>
                <p className="text-base font-bold text-slate-50">Voce acertou.</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  O pais secreto de hoje era <strong>{target.name}</strong>. Volte
                  amanha para um novo desafio.
                </p>
              </>
            ) : gameState.guesses.length >= MAX_GUESSES ? (
              <>
                <p className="text-base font-bold text-slate-50">
                  Tentativas encerradas.
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  O pais secreto de hoje era <strong>{target.name}</strong>. Amanha
                  tem outro.
                </p>
              </>
            ) : (
              <>
                <p className="text-base font-bold text-slate-50">Jogo em andamento.</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Restam <strong>{MAX_GUESSES - gameState.guesses.length}</strong>{" "}
                  palpites para descobrir o pais.
                </p>
              </>
            )}
          </div>

          <div className={`mt-5 ${isFinished ? "opacity-100" : "opacity-70"}`}>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.35em] text-amber-300">
              Resposta
            </p>
            <div className="flex items-center gap-4 rounded-[1.4rem] border border-white/8 bg-white/5 p-5">
              <span className="text-4xl">{isFinished ? target.flag : "🏳️"}</span>
              <div>
                <strong className="block text-slate-50">
                  {isFinished ? target.name : "Pais oculto"}
                </strong>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {isFinished
                    ? `${target.continent} | ${formatPopulation(target.population)} habitantes`
                    : "A resposta aparece quando voce vence ou esgota as tentativas."}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

function Cell({ status, children }) {
  return (
    <div className={`rounded-3xl border p-4 ${getToneClasses(status)}`}>{children}</div>
  );
}

function LegendItem({ color, text }) {
  return (
    <li className="flex items-center gap-3">
      <span className={`h-3.5 w-3.5 rounded-full ${color}`} />
      <span>{text}</span>
    </li>
  );
}

function PolicySection({ title, text }) {
  return (
    <article className="rounded-[1.6rem] border border-white/8 bg-white/5 p-5">
      <h2 className="text-lg font-black text-slate-50">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-slate-300 md:text-base">{text}</p>
    </article>
  );
}

function FooterNav({ onNavigate, compact = false }) {
  return (
    <footer
      className={`relative z-10 mt-auto flex flex-col items-center justify-center gap-3 pb-2 text-center ${
        compact ? "pt-8" : "pt-4"
      }`}
    >
      <div className="flex items-center gap-3">
        <NavLink
          href="/privacy"
          onNavigate={onNavigate}
          className="rounded-full border border-white/15 bg-slate-950/55 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-slate-100"
        >
          Politica de privacidade
        </NavLink>
      </div>
      <p className="max-w-xl text-xs leading-6 text-slate-200/70">
        Flagdle e um projeto independente inspirado em jogos diarios de adivinhacao.
      </p>
    </footer>
  );
}

export default App;
