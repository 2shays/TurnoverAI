import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number) {
  if (num >= 10000000) {
    return '₹' + (num / 10000000).toFixed(2) + ' Cr';
  }
  if (num >= 100000) {
    return '₹' + (num / 100000).toFixed(2) + ' L';
  }
  return '₹' + formatLargeNumber(Math.round(num));
}

export function formatLargeNumber(num: number): string {
  const numStr = Math.round(num).toString();
  const lastThree = numStr.length > 3 ? numStr.substring(numStr.length - 3) : numStr;
  const otherNumbers = numStr.substring(0, numStr.length - 3);
  if (otherNumbers !== '') {
    return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree;
  }
  return lastThree;
}
