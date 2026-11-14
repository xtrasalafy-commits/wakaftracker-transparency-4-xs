import { customAlphabet } from "nanoid";

// Unambiguous alphabet (no 0/O, 1/I) for printed certificate codes.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const nano = customAlphabet(ALPHABET, 8);

/**
 * Generates a unique, human-friendly waqf certificate code.
 * Format: WKF-YYYYMM-XXXXXXXX (e.g. WKF-202606-7F3K9QX2)
 */
export function generateCertificateCode(date: Date = new Date()): string {
  const yyyymm = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}`;
  return `WKF-${yyyymm}-${nano()}`;
}
