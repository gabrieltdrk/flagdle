import type { Country, GuessFeedback, NumericFeedback, ColorFeedback } from "../../types/country";
import { countries } from "./daily-data";
import { normalizeText } from "../../utils/text-utils";

export const maxGuesses = 8;

export function getTodayKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getDailyTarget(dateKey: string): Country {
  const [year, month, day] = dateKey.split("-").map(Number);
  const startUtc = Date.UTC(2026, 0, 1);
  const todayUtc = Date.UTC(year, month - 1, day);
  const diff = Math.floor((todayUtc - startUtc) / 86400000);
  const index = ((diff % countries.length) + countries.length) % countries.length;

  return countries[index];
}

export function getCountryByGuess(input: string): Country | undefined {
  const normalized = normalizeText(input);

  return countries.find((country) => {
    if (normalizeText(country.name) === normalized) {
      return true;
    }

    return country.aliases.some((alias) => normalizeText(alias) === normalized);
  });
}

export function getSuggestions(query: string, guessedCodes: Set<string>): Country[] {
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

export function getGuessFeedback(guessCountry: Country, targetCountry: Country): GuessFeedback {
  return {
    continent: guessCountry.continent === targetCountry.continent ? "exact" : "miss",
    hemisphere: guessCountry.hemisphere === targetCountry.hemisphere ? "exact" : "miss",
    colors: compareColors(guessCountry.colors, targetCountry.colors),
    population: compareNumeric(guessCountry.population, targetCountry.population),
    area: compareNumeric(guessCountry.area, targetCountry.area),
  };
}

function compareNumeric(guessValue: number, targetValue: number): NumericFeedback {
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

function compareColors(guessColors: string[], targetColors: string[]): ColorFeedback {
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

function sortColors(colors: string[]): string {
  return [...colors].sort().join("|");
}

export function getDirectionText(direction: NumericFeedback["direction"]): string {
  if (direction === "up") {
    return "O alvo e maior";
  }

  if (direction === "down") {
    return "O alvo e menor";
  }

  return "Valor exato";
}

export function getToneClasses(status: GuessFeedback["continent"] | GuessFeedback["colors"]["status"]): string {
  if (status === "exact") {
    return "border-emerald-300 bg-emerald-100";
  }

  if (status === "close") {
    return "border-amber-300 bg-amber-100";
  }

  return "border-slate-200 bg-white/85";
}
