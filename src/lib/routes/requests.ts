import { UserData } from "../utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const username = process.env.NEXT_PUBLIC_API_USERNAME;
  const password = process.env.NEXT_PUBLIC_API_PASSWORD;

  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Basic ${btoa(`${username}:${password}`)}`);
  headers.set('Content-Type', 'application/json');

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}

export async function verifyToken(): Promise<UserData> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/verify-token`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Token verification failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error verifying token:', error);
    throw error;
  }
}

export async function fetchWithoutAuth(url: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}
