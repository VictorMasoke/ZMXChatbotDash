import { fetchWithAuth } from "./requests";


export async function getRegisteredUsers() {
  try {
    // Fake delay for development
    await new Promise((resolve) => setTimeout(resolve, 500));
    return await fetchWithAuth('/api/users');
  } catch (error) {
    console.error('Error fetching registered users:', error);
    return [];
  }
}

export async function getBuyOrders() {
  try {
    // Fake delay for development
    await new Promise((resolve) => setTimeout(resolve, 500));
    return await fetchWithAuth('/api/buy-orders');
  } catch (error) {
    console.error('Error fetching buy orders:', error);
    return [];
  }
}

export async function getSellOrders() {
  try {
    // Fake delay for development
    await new Promise((resolve) => setTimeout(resolve, 500));
    return await fetchWithAuth('/api/sell-orders');
  } catch (error) {
    console.error('Error fetching sell orders:', error);
    return [];
  }
}

// Dashboard functions
export async function getDashboardUsers() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return await fetchWithAuth('/api/dashboard/users');
  } catch (error) {
    console.error('Error fetching dashboard user stats:', error);
    return null;
  }
}

export async function getDashboardBuyOrders() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return await fetchWithAuth('/api/dashboard/buy-orders');
  } catch (error) {
    console.error('Error fetching dashboard buy order stats:', error);
    return null;
  }
}

export async function getDashboardSellOrders() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return await fetchWithAuth('/api/dashboard/sell-orders');
  } catch (error) {
    console.error('Error fetching dashboard sell order stats:', error);
    return null;
  }
}

export async function getOrderTrends() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return await fetchWithAuth('/api/dashboard/order-trends');
  } catch (error) {
    console.error('Error fetching order trends:', error);
    return [];
  }
}

// AI Learning functions
export async function getAILearningData() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return await fetchWithAuth('/api/ai-learning');
  } catch (error) {
    console.log(error);
    console.error('Error fetching AI learning data:', error);
    return [];
  }
}

export async function addAILearningData(data: { model_name: string; input_text: string; prediction: string }) {
  try {
    const response = await fetchWithAuth('/api/add-learning-data', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return response;
  } catch (error) {
    console.error('Error adding AI learning data:', error);
    throw error;
  }
}

export async function sendCustomMessage(data: { phone_number: string; message: string }) {
  try {
    const response = await fetchWithAuth('/api/send-custom-message', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return response;
  } catch (error) {
    console.error('Error sending custom message:', error);
    throw error;
  }
}

// Add this to your existing API functions
export async function deleteAILearningData(id: number) {
  try {
    const response = await fetchWithAuth(`/api/ai-learning/${id}`, {
      method: 'DELETE',
    });
    return response;
  } catch (error) {
    console.error('Error deleting AI learning data:', error);
    throw error;
  }
}

