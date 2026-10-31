const VITE_API_BASE = import.meta.env.VITE_API_URL 
  ? `${String(import.meta.env.VITE_API_URL).replace(/\/+$/, '')}/api`
  : '/api';

const API_BASE = VITE_API_BASE;

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    const token = localStorage.getItem('verynth_token') || sessionStorage.getItem('verynth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<{ data: T; status: number }> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText || 'Request failed' }));
      let message = 'Request failed';
      if (typeof errorData.detail === 'string') {
        message = errorData.detail;
      } else if (Array.isArray(errorData.detail)) {
        message = errorData.detail.map((e: any) => e.msg || e.message).join('; ');
      } else if (errorData.message) {
        message = errorData.message;
      } else {
        message = response.status === 401 ? 'Invalid email or password' : `HTTP error ${response.status}`;
      }

      const err = new Error(message);
      (err as any).status = response.status;
      (err as any).detail = errorData.detail;
      throw err;
    }

    const data = await response.json();
    return { data, status: response.status };
  }

  async get<T>(endpoint: string): Promise<{ data: T; status: number }> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body?: unknown): Promise<{ data: T; status: number }> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(endpoint: string, body?: unknown): Promise<{ data: T; status: number }> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<{ data: T; status: number }> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient(API_BASE);
