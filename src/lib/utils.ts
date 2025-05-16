import clsx from "clsx";
import { twMerge } from "tw-merge";

export function cn(...inputs: (string | undefined | null)[]) {
  return twMerge(clsx(inputs));
}
