// Structural interface compatible with both firebase-admin and firebase client SDK Timestamps
export interface Timestamp {
  seconds: number;
  nanoseconds: number;
  toDate(): Date;
}

export type Currency = "USD" | "EUR" | "MXN" | "GBP" | "SEK" | "CHF" | "JPY" | "COP";
export type Domain = "INCOME" | "EXPENSE" | "INVESTMENT" | "SAVING";
export type Frequency =
  | "ONE_TIME"
  | "WEEKLY"
  | "BIWEEKLY"
  | "MONTHLY"
  | "QUARTERLY"
  | "YEARLY";

export interface User {
  id: string;
  mainCurrency: Currency;
  onboardingCompleted: boolean;
  onboardingMode?: "MAGIC" | "ASSISTED";
  createdAt: Timestamp;
}

export interface Category {
  id?: string;
  userId: string;
  domain: Domain;
  name: string;
  isDefault?: boolean;
  archived?: boolean;
  createdAt: Timestamp;
}

export interface RecurringItem {
  id?: string;
  userId: string;
  domain: Domain;
  categoryId: string;
  name: string;
  amount: number;
  currency: Currency;
  frequency: Frequency;
  paymentMethodId?: string;
  startDate: Timestamp;
  endDate?: Timestamp;
  nextOccurrence?: Timestamp;
  active: boolean;
}

export interface Transaction {
  id?: string;
  userId: string;
  domain: Domain;
  recurringItemId?: string;
  categoryId: string;
  name: string;
  amount: number;
  currency: Currency;
  paymentMethodId?: string;
  occurredAt: Timestamp;
  status: "PENDING" | "PAID" | "SKIPPED";
}
