import { v4 as uuid } from 'uuid';

export function generateReferralCode(
  length: number = 8,
  prefix: string = 'REFF-',
): string {
  // Convert UUID to Base36 (numbers + lowercase letters) and remove dashes
  const uniqueCode = parseInt(uuid().replace(/-/g, ''), 16)
    .toString(36)
    .toUpperCase();

  // Trim to desired length and add prefix
  return prefix + uniqueCode.slice(0, length);
}
