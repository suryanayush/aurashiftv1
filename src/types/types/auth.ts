// Auth-related types

export type AuthMode = 'login' | 'register';

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterCredentials = {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
};
