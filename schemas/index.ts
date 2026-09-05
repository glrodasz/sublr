import { z } from "zod";

export const CurrencySchema = z.enum([
  "USD",
  "EUR",
  "MXN",
  "GBP",
  "SEK",
  "CHF",
  "JPY",
  "COP",
]);

export const DomainSchema = z.enum([
  "INCOME",
  "EXPENSE",
  "INVESTMENT",
  "SAVING",
]);

export const FrequencySchema = z.enum([
  "ONE_TIME",
  "WEEKLY",
  "BIWEEKLY",
  "MONTHLY",
  "QUARTERLY",
  "YEARLY",
]);

export const CategoryInputSchema = z.object({
  domain: DomainSchema,
  name: z.string().min(1).max(40).trim(),
});

export const CategoryUpdateSchema = z.object({
  name: z.string().min(1).max(40).trim().optional(),
  archived: z.boolean().optional(),
});

export type CategoryInput = z.infer<typeof CategoryInputSchema>;
export type CategoryUpdate = z.infer<typeof CategoryUpdateSchema>;
