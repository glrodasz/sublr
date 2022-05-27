import { getCreditCardType } from "./getCreditCardType";

export const getCreditCardIconName = (type) =>
  getCreditCardType(type).toLowerCase();
