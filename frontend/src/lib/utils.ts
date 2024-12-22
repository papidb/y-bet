import { Game } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// utils
export function removeDuplicates(arr: Game[]) {
  const hash = new Set();
  return arr.filter((item) => {
    if (!hash.has(item)) {
      hash.add(item);
      return true;
    }
    return false;
  });
}
