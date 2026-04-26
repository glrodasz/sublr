import { getCreditCardType } from "./getCreditCardType";

export const getCreditCardIconName = (type: string): string =>
  getCreditCardType(type).toLowerCase();
