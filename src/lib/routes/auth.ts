import { AuthResponse } from "../utils";
import { fetchWithAuth, fetchWithoutAuth } from "./requests";

export async function getDashboardUsers() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return await fetchWithAuth('/api/dashboard/users');
  } catch (error) {
    console.error('Error fetching dashboard user stats:', error);
    return null;
  }
}

export async function getAdminUsers() {
  try {
    // Fake delay for development
    await new Promise((resolve) => setTimeout(resolve, 500));
    return await fetchWithoutAuth('/api/admin/users');
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return [];
  }
}

export async function adminSignUp(data: {
  email: string;
  first_name: string;
  last_name: string;
  bio: string;
  password: string
}): Promise<AuthResponse> {
  try {
    const response = await fetchWithAuth('/api/admin/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    return await response;
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
}

export async function signIn(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  try {
    const response = await fetchWithAuth('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    return await response;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}

export async function resetPassword(data: {
  email: string;
  current_password: string;
  new_password: string
}): Promise<{ message: string }> {
  try {
    const response = await fetchWithoutAuth('/api/admin/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response;
      throw new Error(errorData.message || 'Password reset failed');
    }

    return await response;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
}
