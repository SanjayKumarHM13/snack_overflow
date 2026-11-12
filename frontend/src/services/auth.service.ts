import { apiFetch, setCsrfToken } from './api';
import { User } from '../types/index';

export interface LoginResponse {
  user: User;
  csrfToken?: string;
}

export const authService = {
  async fetchCsrfToken(): Promise<string> {
    const data = await apiFetch<{ csrfToken: string }>('/auth/csrf-token');
    if (data.csrfToken) {
      setCsrfToken(data.csrfToken);
    }
    return data.csrfToken;
  },

  async login(email: string, passwordPlain: string): Promise<User> {
    // Ensure fresh CSRF token prior to login
    await this.fetchCsrfToken();

    const data = await apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: passwordPlain }),
    });

    if (data.csrfToken) {
      setCsrfToken(data.csrfToken);
    }

    return data.user;
  },

  async logout(): Promise<void> {
    try {
      await apiFetch<{ message: string }>('/auth/logout', {
        method: 'POST',
      });
    } finally {
      setCsrfToken(null);
    }
  },

  async getMe(): Promise<User> {
    const data = await apiFetch<{ user: User }>('/auth/me');
    return data.user;
  },
};
