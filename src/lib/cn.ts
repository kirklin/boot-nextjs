import type { ClassValue } from "cfuse";
import { cfuse } from "cfuse";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(cfuse(inputs));
}
