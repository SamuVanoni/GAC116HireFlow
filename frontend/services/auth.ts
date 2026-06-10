import type { AuthTokens } from "@/types/hireflow";

const tokenStorageKey = "hireflow.tokens";

export function getStoredTokens() {
  if (typeof window === "undefined") {
    return null;
  }

  const storedTokens = window.localStorage.getItem(tokenStorageKey);
  return storedTokens ? (JSON.parse(storedTokens) as AuthTokens) : null;
}

export function storeTokens(tokens: AuthTokens) {
  window.localStorage.setItem(tokenStorageKey, JSON.stringify(tokens));
}

export function clearTokens() {
  window.localStorage.removeItem(tokenStorageKey);
}
