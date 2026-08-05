const ACCESS_TOKEN_STORAGE_KEY = "buildflow_access_token";

function getLocalStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function getAccessToken(): string | null {
  try {
    return getLocalStorage()?.getItem(ACCESS_TOKEN_STORAGE_KEY) ?? null;
  } catch {
    return null;
  }
}

export function saveAccessToken(token: string): void {
  try {
    getLocalStorage()?.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
  } catch {
    // Authentication remains available for the current in-memory session.
  }
}

export function removeAccessToken(): void {
  try {
    getLocalStorage()?.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  } catch {
    // There is no persistent token to remove when storage is unavailable.
  }
}
