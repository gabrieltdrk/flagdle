export type Country = {
  code: string;
  name: string;
  aliases: string[];
  flag: string;
  continent: string;
  hemisphere: string;
  colors: string[];
  population: number;
  area: number;
};

export type DailyState = {
  dateKey: string;
  guesses: Country[];
  won: boolean;
};

export type GuessStatus = "exact" | "close" | "miss";

export type NumericFeedback = {
  status: GuessStatus;
  direction: "up" | "down" | "equal";
};

export type ColorFeedback = {
  status: GuessStatus;
  shared: string[];
};

export type GuessFeedback = {
  continent: "exact" | "miss";
  hemisphere: "exact" | "miss";
  colors: ColorFeedback;
  population: NumericFeedback;
  area: NumericFeedback;
};
