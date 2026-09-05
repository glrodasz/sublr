import type { PaymentMethodType } from "../../types";

/** The type picker in step 2 of the wizard. */
export const PAYMENT_METHOD_TYPE_OPTIONS: { value: PaymentMethodType; label: string }[] = [
  { value: "CREDIT_CARD", label: "Credit card" },
  { value: "DEBIT_CARD", label: "Debit card" },
  { value: "BANK_TRANSFER", label: "Bank transfer" },
  { value: "DIGITAL_WALLET", label: "Digital wallet" },
  { value: "CASH", label: "Cash" },
  { value: "CRYPTO_WALLET", label: "Crypto wallet" },
  { value: "OTHER", label: "Other" },
];

/** Only these ask for the last 4 digits. */
export const CARD_TYPES: PaymentMethodType[] = ["CREDIT_CARD", "DEBIT_CARD"];

/**
 * Network/provider suggestions, shown only for the types listed here. A type
 * absent from this map (Bank transfer, Cash, Crypto wallet, Other) gets no
 * extra field — there's no useful fixed list for "which bank" or "which coin".
 */
export const NETWORK_SUGGESTIONS: Partial<Record<PaymentMethodType, string[]>> = {
  CREDIT_CARD: [
    "Visa",
    "Mastercard",
    "American Express",
    "Discover",
    "Diners Club",
    "JCB",
    "UnionPay",
  ],
  DEBIT_CARD: ["Visa", "Mastercard", "American Express", "Discover"],
  DIGITAL_WALLET: [
    "Wise",
    "PayPal",
    "Revolut",
    "Venmo",
    "Cash App",
    "Zelle",
    "Swish",
    "Apple Pay",
    "Google Pay",
  ],
};

/** Label for the network/provider field — differs by vocabulary, not behavior. */
export function networkFieldLabel(type: PaymentMethodType): string {
  return type === "DIGITAL_WALLET" ? "Provider" : "Card network";
}
