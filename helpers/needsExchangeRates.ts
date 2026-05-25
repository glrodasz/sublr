import type { Subscription } from "../types";

export const needsExchangeRates = (subscriptions: Subscription[]): boolean =>
  subscriptions.some((s) => s.currency !== "USD");
