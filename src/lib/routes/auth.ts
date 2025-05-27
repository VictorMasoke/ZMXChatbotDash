import { fetchWithAuth, fetchWithoutAuth } from "./requests";

export async function getAdminUsers() {
  try {
    // Fake delay for development
    await new Promise((resolve) => setTimeout(resolve, 500));
    return await fetchWithAuth('/api/admin/users');
  } catch (error) {
    console.error('Error fetching amin users:', error);
    return [];
  }
}

export async function adminSignUp(data: { email: string; first_name: string; last_name: string, bio: string, password: string }) {
  try {
    const response = await fetchWithAuth('/api/admin/signup', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return response;
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
}

export async function signIn(data: { email: string; password: string;}) {
  try {
    const response = await fetchWithoutAuth('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return response;
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
}

export async function resetPassword(data: { email: string; current_password: string; new_password: string }) {
  try {
    const response = await fetchWithoutAuth('/api/admin/change-password', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return response;
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
}
