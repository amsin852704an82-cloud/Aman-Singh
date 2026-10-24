// BharatConnect API Client with CSRF & Secure Cookie support

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

let csrfToken: string | null = null;

export async function getCsrfToken(): Promise<string> {
  if (csrfToken) return csrfToken;
  try {
    const res = await fetch(`${BASE}/api/v1/auth/csrf-token`, {
      credentials: 'include'
    });
    if (res.ok) {
      const data = await res.json();
      csrfToken = data.csrfToken || '';
      return csrfToken || '';
    }
  } catch (err) {
    console.warn('Failed to fetch CSRF token:', err);
  }
  return '';
}

export async function apiClient<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Attach CSRF token on state-changing requests
  const method = (options.method || 'GET').toUpperCase();
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const token = await getCsrfToken();
    if (token) {
      headers.set('X-CSRF-Token', token);
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include' // Send and receive httpOnly cookies
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || (data.details ? JSON.stringify(data.details) : response.statusText);
    throw new Error(errorMsg);
  }

  return data as T;
}
