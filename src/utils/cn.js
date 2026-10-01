import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines conditional classes via clsx and cleanly merges 
 * conflicting Tailwind CSS styles using tailwind-merge.
 * 
 * @param {...import('clsx').ClassValue[]} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
