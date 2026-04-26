export type Currency = "USD" | "COP" | "SEK" | "EUR";
export type TimeAttribute = "MONTHLY" | "YEARLY";
export type CardSide = "frontside" | "backside";

export interface CreditCard {
  type: string;
  number: number | string;
}

export interface Subscription {
  id?: string;
  unsplashId?: string;
  title?: string;
  tags?: string[];
  price: number;
  currency: Currency;
  time: TimeAttribute;
  creditCard?: CreditCard;
  userId?: string;
}

export type ExchangeRates = Partial<Record<Currency, number>>;

export interface GroupedCardEntry {
  price: number;
  currency: Currency | undefined;
}

export type GroupedByCard = Record<string, GroupedCardEntry>;

export interface SummaryEntry {
  key: string;
  creditCard: { type: string; number: string };
  monthly: { price: number; currency: Currency | undefined };
  yearly: { price: number; currency: Currency | undefined };
}

export interface SummaryTotal {
  monthly: number;
  yearly: number;
}

export interface FieldChange {
  id: string;
  value: string | string[] | number;
}

export interface FilterState {
  search: string;
  tag: string | null;
  currency: Currency;
  time: TimeAttribute | null;
}
