export type RegistrationRequest = {
  username: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type AuthTokenResponse = {
  access_token: string;
  token_type: string;
};

export type CurrentUserResponse = {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  created_at: string;
};
