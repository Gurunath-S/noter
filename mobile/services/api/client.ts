/**
 * API Client Architecture
 * Prepared for future Node + Express + MongoDB backend.
 * In offline/local mode, resolves via local storage repository with simulated network latency.
 */

export const API_CONFIG = {
  // Toggle between 'offline_first' and 'remote_server'
  MODE: 'offline_first' as 'offline_first' | 'remote_server',
  // Base URL for future Node + Express + MongoDB server
  BASE_URL: 'http://localhost:5000/api',
  TIMEOUT_MS: 8000,
  SIMULATED_DELAY_MS: 150,
};

export async function simulateNetworkDelay(ms = API_CONFIG.SIMULATED_DELAY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl = API_CONFIG.BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async get<T>(path: string): Promise<T> {
    if (API_CONFIG.MODE === 'remote_server') {
      const res = await fetch(`${this.baseUrl}${path}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    }
    await simulateNetworkDelay();
    throw new Error('Using offline repository');
  }

  async post<T, B>(path: string, body: B): Promise<T> {
    if (API_CONFIG.MODE === 'remote_server') {
      const res = await fetch(`${this.baseUrl}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    }
    await simulateNetworkDelay();
    throw new Error('Using offline repository');
  }

  async put<T, B>(path: string, body: B): Promise<T> {
    if (API_CONFIG.MODE === 'remote_server') {
      const res = await fetch(`${this.baseUrl}${path}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    }
    await simulateNetworkDelay();
    throw new Error('Using offline repository');
  }

  async delete<T>(path: string): Promise<T> {
    if (API_CONFIG.MODE === 'remote_server') {
      const res = await fetch(`${this.baseUrl}${path}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    }
    await simulateNetworkDelay();
    throw new Error('Using offline repository');
  }
}

export const apiClient = new ApiClient();
