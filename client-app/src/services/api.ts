const API_BASE_URL = __DEV__ 
  ? 'http://10.0.2.2:3000/api' 
  : 'https://your-production-api.com/api';

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const accessToken = await this.getAccessToken();
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  private async getAccessToken(): Promise<string | null> {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    return await AsyncStorage.getItem('accessToken');
  }

  async refreshAccessToken(): Promise<string | null> {
    const SecureStore = require('expo-secure-store').default;
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    
    try {
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      if (!refreshToken) return null;

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) return null;

      const { accessToken } = await response.json();
      await AsyncStorage.setItem('accessToken', accessToken);
      return accessToken;
    } catch (error) {
      console.error('Token refresh error:', error);
      return null;
    }
  }

  // Auth
  async register(name: string, email: string, password: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Pets
  async getPets() {
    return this.request('/pets');
  }

  async getPet(id: string) {
    return this.request(`/pets/${id}`);
  }

  async createPet(data: { name: string; breed: string; age: number; temperament?: string }) {
    return this.request('/pets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePet(id: string, data: Partial<{ name: string; breed: string; age: number; temperament: string }>) {
    return this.request(`/pets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePet(id: string) {
    return this.request(`/pets/${id}`, {
      method: 'DELETE',
    });
  }

  // Bookings
  async getBookings() {
    return this.request('/bookings');
  }

  async getBooking(id: string) {
    return this.request(`/bookings/${id}`);
  }

  async createBooking(data: {
    pet_ids: string[];
    start_datetime: string;
    end_datetime: string;
    latitude: number;
    longitude: number;
    address_text: string;
    allow_previsit: boolean;
    previsit_start_date?: string;
    previsit_end_date?: string;
    care_description?: string;
  }) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBooking(id: string, data: any) {
    return this.request(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBooking(id: string) {
    return this.request(`/bookings/${id}`, {
      method: 'DELETE',
    });
  }
}

export default new ApiService();
