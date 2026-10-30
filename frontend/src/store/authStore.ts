import { create } from 'zustand';
import { api } from '../services/api';
import type { AuthState } from '../types';

const initialPresentation = localStorage.getItem('verynth_presentation_mode') === 'true';
if (initialPresentation) {
  document.documentElement.classList.add('presentation-mode');
}

function getStoredUser(): any | null {
  try {
    const raw = localStorage.getItem('verynth_user') || sessionStorage.getItem('verynth_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistSession(token: string, user: any, remember: boolean = true) {
  localStorage.removeItem('verynth_token');
  localStorage.removeItem('verynth_user');
  sessionStorage.removeItem('verynth_token');
  sessionStorage.removeItem('verynth_user');

  const storage = remember ? localStorage : sessionStorage;
  storage.setItem('verynth_token', token);
  if (user) {
    storage.setItem('verynth_user', JSON.stringify(user));
  }
}

function clearSession() {
  localStorage.removeItem('verynth_token');
  localStorage.removeItem('verynth_user');
  sessionStorage.removeItem('verynth_token');
  sessionStorage.removeItem('verynth_user');
  sessionStorage.removeItem('verynth_remember');
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: getStoredUser(),
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
      const cleanEmail = email.trim().toLowerCase();
      const remember = sessionStorage.getItem('verynth_remember') !== 'false';
      const { data } = await api.post<{ token: string; user: any }>('/auth/signin', { email: cleanEmail, password });
      persistSession(data.token, data.user, remember);
      set({ token: data.token, user: data.user, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  signup: async (name, email, password) => {
    set({ isLoading: true });
    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanName = name.trim();
      const { data } = await api.post<{ token: string; user: any }>('/auth/signup', { name: cleanName, email: cleanEmail, password });
      persistSession(data.token, data.user, true);
      set({ token: data.token, user: data.user, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  loginDemo: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.post<{ token: string; user: any }>('/demo/session');
      persistSession(data.token, data.user, true);
      set({ token: data.token, user: data.user, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUser: async () => {
    try {
      const { data } = await api.get<any>('/auth/me');
      const remember = !!localStorage.getItem('verynth_token');
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem('verynth_user', JSON.stringify(data));
      set({ user: data });
    } catch (err: any) {
      if (err.status === 401) {
        clearSession();
        set({ user: null, token: null, isAuthenticated: false });
      }
    }
  },

  logout: () => {
    clearSession();
    set({ user: null, token: null, isAuthenticated: false });
  },

  setToken: (token) => {
    localStorage.setItem('verynth_token', token);
    set({ token, isAuthenticated: true });
  },
}));
