// Structural interface compatible with both firebase-admin and firebase client SDK Timestamps
export interface Timestamp {
  seconds: number;
  nanoseconds: number;
  toDate(): Date;
}

export type Currency = "USD" | "EUR" | "MXN" | "GBP" | "SEK" | "CHF" | "JPY" | "COP";
export type Domain = "INCOME" | "EXPENSE" | "INVESTMENT" | "SAVING";
export type Frequency = "ONE_TIME" | "WEEKLY" | "BIWEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY";

export type TransactionStatus = "PENDING" | "PAID" | "SKIPPED";

export type PaymentMethodType =
  | "CREDIT_CARD"
  | "DEBIT_CARD"
  | "BANK_TRANSFER"
  | "DIGITAL_WALLET"
  | "CASH"
  | "CRYPTO_WALLET"
  | "OTHER";

export type RecurrentTransactionType =
  | "SUBSCRIPTION"
  | "SALARY"
  | "SAVINGS_TRANSFER"
  | "LOAN_PAYMENT"
  | "UTILITY"
  | "OTHER";

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
  parentId?: string;
  isDefault?: boolean;
  archived?: boolean;
  createdAt: Timestamp;
}

export interface PaymentMethod {
  id?: string;
  userId: string;
  name: string;
  type: PaymentMethodType;
  currencies: Currency[];
  defaultCurrency?: Currency;
  last4?: string;
  alias?: string;
  archived?: boolean;
  createdAt: Timestamp;
}

export interface RecurrentTransaction {
  id?: string;
  userId: string;
  domain: Domain;
  categoryId: string;
  name: string;
  amount: number;
  currency: Currency;
  chargedAmount?: number;
  chargedCurrency?: Currency;
  frequency: Frequency;
  type?: RecurrentTransactionType;
  paymentMethodId?: string;
  serviceSnapshot?: {
    serviceId: string;
    name: string;
    logoUrl?: string;
  };
  startDate: Timestamp;
  endDate?: Timestamp;
  nextOccurrence?: Timestamp;
  active: boolean;
  createdAt?: Timestamp;
}

export interface Transaction {
  id?: string;
  userId: string;
  domain: Domain;
  recurrentTransactionId?: string;
  categoryId: string;
  name: string;
  amount: number;
  currency: Currency;
  chargedAmount?: number;
  chargedCurrency?: Currency;
  paymentMethodId?: string;
  occurredAt: Timestamp;
  status: TransactionStatus;
  createdAt?: Timestamp;
}

export interface ServicePrice {
  tier: string;
  amount: number;
  currency: Currency;
  frequency: Frequency;
}

// Prices keyed by ISO 3166-1 alpha-2 country code ("US", "CO", "MX", etc.)
// Use key "DEFAULT" for services with a single global price (no per-country variation)
export interface Service {
  id?: string;
  name: string;
  logoUrl?: string;
  domain: Domain;
  defaultCategoryHint?: string;
  prices: Record<string, ServicePrice[]>;
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
