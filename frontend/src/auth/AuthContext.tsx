import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";

import { ApiError } from "../api/apiClient";
import {
  getCurrentUser,
  login as requestLogin,
  register as requestRegistration,
} from "../api/authApi";
import type {
  CurrentUserResponse,
  LoginRequest,
  RegistrationRequest,
} from "../types/auth";
import {
  getAccessToken,
  removeAccessToken,
  saveAccessToken,
} from "./tokenStorage";

type AuthContextValue = {
  currentUser: CurrentUserResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (loginData: LoginRequest) => Promise<void>;
  register: (
    registrationData: RegistrationRequest,
  ) => Promise<CurrentUserResponse>;
  logout: () => void;
  refreshCurrentUser: () => Promise<void>;
};

type BootstrapRequest = {
  token: string;
  promise: Promise<CurrentUserResponse>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
let bootstrapRequest: BootstrapRequest | null = null;

function requestBootstrapUser(token: string): Promise<CurrentUserResponse> {
  if (bootstrapRequest?.token === token) {
    return bootstrapRequest.promise;
  }

  const promise = getCurrentUser();
  const request = { token, promise };
  bootstrapRequest = request;

  void promise.then(
    () => {
      if (bootstrapRequest === request) {
        bootstrapRequest = null;
      }
    },
    () => {
      if (bootstrapRequest === request) {
        bootstrapRequest = null;
      }
    },
  );

  return promise;
}

function isInvalidSession(error: unknown): boolean {
  return (
    error instanceof ApiError && (error.status === 401 || error.status === 403)
  );
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(() => getAccessToken());
  const [currentUser, setCurrentUser] =
    useState<CurrentUserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(() => token !== null);
  const initialToken = useRef(token);

  const clearAuthState = useCallback(() => {
    removeAccessToken();
    setToken(null);
    setCurrentUser(null);
  }, []);

  useEffect(() => {
    const storedToken = initialToken.current;

    if (!storedToken) {
      return;
    }

    let isActive = true;

    void requestBootstrapUser(storedToken)
      .then((user) => {
        if (isActive) {
          setCurrentUser(user);
        }
      })
      .catch((error: unknown) => {
        if (isActive && isInvalidSession(error)) {
          clearAuthState();
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [clearAuthState]);

  const refreshCurrentUser = useCallback(async () => {
    const storedToken = getAccessToken();

    if (!storedToken) {
      clearAuthState();
      return;
    }

    try {
      const user = await getCurrentUser();
      setToken(storedToken);
      setCurrentUser(user);
    } catch (error: unknown) {
      if (isInvalidSession(error)) {
        clearAuthState();
      }

      throw error;
    }
  }, [clearAuthState]);

  const login = useCallback(
    async (loginData: LoginRequest) => {
      const authResponse = await requestLogin(loginData);
      saveAccessToken(authResponse.access_token);
      setToken(authResponse.access_token);

      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error: unknown) {
        clearAuthState();
        throw error;
      }
    },
    [clearAuthState],
  );

  const register = useCallback(
    (registrationData: RegistrationRequest) =>
      requestRegistration(registrationData),
    [],
  );

  const logout = useCallback(() => {
    clearAuthState();
  }, [clearAuthState]);

  const value = useMemo<AuthContextValue>(
    () => ({
      currentUser,
      token,
      isAuthenticated: Boolean(token && currentUser),
      isLoading,
      login,
      register,
      logout,
      refreshCurrentUser,
    }),
    [
      currentUser,
      isLoading,
      login,
      logout,
      refreshCurrentUser,
      register,
      token,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
