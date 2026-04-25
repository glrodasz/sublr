import { CREDIT_CARD_TYPES } from "../constants";

export const getCreditCardType = (type: string): string => CREDIT_CARD_TYPES[type];
