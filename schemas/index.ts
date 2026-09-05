import { z } from "zod";

export const CurrencySchema = z.enum(["USD", "EUR", "MXN", "GBP", "SEK", "CHF", "JPY", "COP"]);

export const DomainSchema = z.enum(["INCOME", "EXPENSE", "INVESTMENT", "SAVING"]);

export const FrequencySchema = z.enum([
  "ONE_TIME",
  "WEEKLY",
  "BIWEEKLY",
  "MONTHLY",
  "QUARTERLY",
  "YEARLY",
]);

export const PaymentMethodTypeSchema = z.enum([
  "CREDIT_CARD",
  "DEBIT_CARD",
  "BANK_TRANSFER",
  "DIGITAL_WALLET",
  "CASH",
  "CRYPTO_WALLET",
  "OTHER",
]);

export const RecurrentTransactionTypeSchema = z.enum([
  "SUBSCRIPTION",
  "SALARY",
  "SAVINGS_TRANSFER",
  "LOAN_PAYMENT",
  "UTILITY",
  "OTHER",
]);

export const CategoryInputSchema = z.object({
  domain: DomainSchema,
  name: z.string().min(1).max(40).trim(),
  parentId: z.string().optional(),
});

export const CategoryUpdateSchema = z.object({
  name: z.string().min(1).max(40).trim().optional(),
  archived: z.boolean().optional(),
});

export const PaymentMethodInputSchema = z.object({
  name: z.string().min(1).max(60).trim(),
  type: PaymentMethodTypeSchema,
  // Optional during onboarding — the API defaults it to the user's mainCurrency.
  currencies: z.array(CurrencySchema).min(1).optional(),
  defaultCurrency: CurrencySchema.optional(),
  last4: z
    .string()
    .regex(/^\d{4}$/, "Must be exactly 4 digits")
    .optional(),
  alias: z.string().max(40).trim().optional(),
});

export const PaymentMethodUpdateSchema = z.object({
  name: z.string().min(1).max(60).trim().optional(),
  type: PaymentMethodTypeSchema.optional(),
  currencies: z.array(CurrencySchema).min(1).optional(),
  defaultCurrency: CurrencySchema.optional(),
  last4: z
    .string()
    .regex(/^\d{4}$/, "Must be exactly 4 digits")
    .optional(),
  alias: z.string().max(40).trim().optional(),
  archived: z.boolean().optional(),
});

export const RecurrentTransactionInputSchema = z.object({
  domain: DomainSchema,
  categoryId: z.string().min(1),
  name: z.string().min(1).max(100).trim(),
  amount: z.number().positive(),
  currency: CurrencySchema,
  chargedAmount: z.number().positive().optional(),
  chargedCurrency: CurrencySchema.optional(),
  frequency: FrequencySchema,
  type: RecurrentTransactionTypeSchema.optional(),
  paymentMethodId: z.string().optional(),
  startDate: z.iso.datetime().optional(),
  active: z.boolean().optional(),
});

export const UserUpdateSchema = z
  .object({
    mainCurrency: CurrencySchema.optional(),
    onboardingCompleted: z.boolean().optional(),
    onboardingMode: z.enum(["MAGIC", "ASSISTED"]).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, {
    message: "At least one field is required",
  });

export type CategoryInput = z.infer<typeof CategoryInputSchema>;
export type CategoryUpdate = z.infer<typeof CategoryUpdateSchema>;
export type PaymentMethodInput = z.infer<typeof PaymentMethodInputSchema>;
export type PaymentMethodUpdate = z.infer<typeof PaymentMethodUpdateSchema>;
export type RecurrentTransactionInput = z.infer<typeof RecurrentTransactionInputSchema>;
export type UserUpdate = z.infer<typeof UserUpdateSchema>;
