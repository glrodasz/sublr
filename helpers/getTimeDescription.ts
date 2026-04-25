import type { TimeAttribute } from "../types";
import { TIME_DESCRIPTION } from "../constants";

export const getTimeDescription = (time: TimeAttribute): string => TIME_DESCRIPTION[time];
