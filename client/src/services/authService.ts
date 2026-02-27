import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  preferences: {
    avatarId: string | null;
    theme: string;
    notifications: boolean;
  };
  subscription: {
    plan: string;
    sessionsUsed: number;
    sessionsLimit: number;
    startDate: Date | null;
    endDate: Date | null;
  };
  emergencyContacts?: EmergencyContact[];
  createdAt: Date;
  lastLogin: Date | null;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

class AuthService {
  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/auth/register`, userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  async login(credentials: LoginData): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await axios.get<{ success: boolean; user: User }>(`${API_URL}/auth/me`, {
        headers: this.getAuthHeader()
      });
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data.user;
    } catch (error: any) {
      this.logout();
      throw new Error(error.response?.data?.message || 'Failed to get user');
    }
  }

  async updateDetails(userData: Partial<User>): Promise<User> {
    try {
      const response = await axios.put<{ success: boolean; user: User }>(
        `${API_URL}/auth/updatedetails`,
        userData,
        { headers: this.getAuthHeader() }
      );
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update details');
    }
  }

  async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await axios.put(
        `${API_URL}/auth/updatepassword`,
        { currentPassword, newPassword },
        { headers: this.getAuthHeader() }
      );
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update password');
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
