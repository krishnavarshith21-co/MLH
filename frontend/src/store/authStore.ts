import { create } from 'zustand';
import { api } from '../services/api';
import type { AuthState } from '../types';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('verynth_token'),
  isAuthenticated: !!localStorage.getItem('verynth_token'),
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await api.post<{ token: string; user: any }>('/auth/signin', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('verynth_token', token);
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signup: async (name: string, email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await api.post<{ token: string; user: any }>('/auth/signup', { name, email, password });
      const { token, user } = response.data;
      localStorage.setItem('verynth_token', token);
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('verynth_token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  setToken: (token: string) => {
    localStorage.setItem('verynth_token', token);
    set({ token, isAuthenticated: true });
  },
}));
