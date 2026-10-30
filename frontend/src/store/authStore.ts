import { create } from 'zustand';
import { api } from '../services/api';
import type { AuthState } from '../types';
export const useAuthStore=create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('verynth_token')||sessionStorage.getItem('verynth_token'),
  isAuthenticated: !!(localStorage.getItem('verynth_token')||sessionStorage.getItem('verynth_token')),
  isLoading: false,
  login: async (email,password) => {
    set({ isLoading: true });
    try {
      const { data }=await api.post<{ token: string; user: any }>('/auth/signin',{ email,password });
      localStorage.removeItem('verynth_token'); sessionStorage.removeItem('verynth_token');
      (sessionStorage.getItem('verynth_remember')==='false'? sessionStorage:localStorage).setItem('verynth_token',data.token);
      set({ ...data,isAuthenticated: true });
    } finally { set({ isLoading: false }); }
  },
  signup: async (name,email,password) => {
    set({ isLoading: true });
    try {
      const { data }=await api.post<{ token: string; user: any }>('/auth/signup',{ name,email,password });
      localStorage.setItem('verynth_token',data.token); set({ ...data,isAuthenticated: true });
    } finally { set({ isLoading: false }); }
  },
  logout: () => { localStorage.removeItem('verynth_token'); sessionStorage.removeItem('verynth_token'); set({ user: null,token: null,isAuthenticated: false }); },
  setToken: token => { localStorage.setItem('verynth_token',token); set({ token,isAuthenticated: true }); },
}));
