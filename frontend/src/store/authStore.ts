import { create } from 'zustand';
import { api } from '../services/api';
import type { AuthState } from '../types';

const initialPresentation = localStorage.getItem('verynth_presentation_mode') === 'true';
if (initialPresentation) {
  document.documentElement.classList.add('presentation-mode');
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('verynth_token') || sessionStorage.getItem('verynth_token'),
  isAuthenticated: !!(localStorage.getItem('verynth_token') || sessionStorage.getItem('verynth_token')),
  isLoading: false,
  isPresentationMode: initialPresentation,

  togglePresentationMode: () => {
    const next = !get().isPresentationMode;
    localStorage.setItem('verynth_presentation_mode', String(next));
    if (next) {
      document.documentElement.classList.add('presentation-mode');
    } else {
      document.documentElement.classList.remove('presentation-mode');
    }
    set({ isPresentationMode: next });
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post<{ token: string; user: any }>('/auth/signin', { email, password });
      localStorage.removeItem('verynth_token');
      sessionStorage.removeItem('verynth_token');
      (sessionStorage.getItem('verynth_remember') === 'false' ? sessionStorage : localStorage).setItem('verynth_token', data.token);
      set({ token: data.token, user: data.user, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  signup: async (name, email, password) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post<{ token: string; user: any }>('/auth/signup', { name, email, password });
      localStorage.setItem('verynth_token', data.token);
      set({ token: data.token, user: data.user, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  loginDemo: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.post<{ token: string; user: any }>('/demo/session');
      localStorage.setItem('verynth_token', data.token);
      set({ token: data.token, user: data.user, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUser: async () => {
    try {
      const { data } = await api.get<any>('/auth/me');
      set({ user: data });
    } catch {
      // Ignored if unauthenticated
    }
  },

  logout: () => {
    localStorage.removeItem('verynth_token');
    sessionStorage.removeItem('verynth_token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  setToken: (token) => {
    localStorage.setItem('verynth_token', token);
    set({ token, isAuthenticated: true });
  },
}));
