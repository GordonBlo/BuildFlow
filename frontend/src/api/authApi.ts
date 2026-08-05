import { apiRequest } from "./apiClient";
import type {
  AuthTokenResponse,
  CurrentUserResponse,
  LoginRequest,
  RegistrationRequest,
} from "../types/auth";

export function register(
  registrationData: RegistrationRequest,
): Promise<CurrentUserResponse> {
  return apiRequest<CurrentUserResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(registrationData),
  });
}

export function login(loginData: LoginRequest): Promise<AuthTokenResponse> {
  return apiRequest<AuthTokenResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(loginData),
  });
}

export function getCurrentUser(): Promise<CurrentUserResponse> {
  return apiRequest<CurrentUserResponse>("/api/auth/me");
}
