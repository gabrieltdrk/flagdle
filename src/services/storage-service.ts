import type { DailyState } from "../types/country";

const storageKey = "flagdle:daily-state";

export function loadDailyState(dateKey: string): DailyState {
  const raw = window.localStorage.getItem(storageKey);

  if (!raw) {
    return { dateKey, guesses: [], won: false };
  }

  try {
    const parsed = JSON.parse(raw) as Partial<DailyState>;

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

export function saveDailyState(state: DailyState): void {
  window.localStorage.setItem(storageKey, JSON.stringify(state));
}
