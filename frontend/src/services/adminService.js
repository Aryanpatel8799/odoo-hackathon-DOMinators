import { API_BASE_URL } from '../config';

class AdminService {
  constructor() {
    this.baseURL = API_BASE_URL || 'http://localhost:3000/api/v1';
  }

  // Get auth token from localStorage or cookies
  getAuthToken() {
    // Try to get token from localStorage first
    const token = localStorage.getItem('adminToken') || localStorage.getItem('adminAccessToken');
    if (token) {
      return token;
    }
    
    // Try to get from cookies
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'adminAccessToken' || name === 'adminToken') {
        return value;
      }
    }
    
    return null;
  }

  // Create headers with auth token
  getHeaders() {
    const token = this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Admin login
  async login(email, password) {
    try {
      const response = await fetch(`${this.baseURL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store admin token
      if (data.data?.accessToken) {
        localStorage.setItem('adminToken', data.data.accessToken);
        localStorage.setItem('adminRefreshToken', data.data.refreshToken);
      }

      return data;
    } catch (error) {
      console.error('Error during admin login:', error);
      throw error;
    }
  }

  // Admin logout
  async logout() {
    try {
      const response = await fetch(`${this.baseURL}/admin/logout`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Logout failed');
      }

      // Clear admin tokens
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminRefreshToken');

      return data;
    } catch (error) {
      console.error('Error during admin logout:', error);
      throw error;
    }
  }

  // Get dashboard stats
  async getDashboardStats() {
    try {
      const response = await fetch(`${this.baseURL}/admin/dashboard/stats`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch dashboard stats');
      }

      return data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  // Get all users
  async getAllUsers(page = 1, limit = 10, search = '', status = '') {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(status && { status }),
      });

      const response = await fetch(`${this.baseURL}/admin/users?${params}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch users');
      }

      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // Ban/Unban user
  async toggleUserBan(userId, action) {
    try {
      const response = await fetch(`${this.baseURL}/admin/users/${userId}/ban`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({ action }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to ${action} user`);
      }

      return data;
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
      throw error;
    }
  }

  // Get all swaps
  async getAllSwaps(page = 1, limit = 10, status = '', search = '') {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status && { status }),
        ...(search && { search }),
      });

      const response = await fetch(`${this.baseURL}/admin/swaps?${params}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch swaps');
      }

      return data;
    } catch (error) {
      console.error('Error fetching swaps:', error);
      throw error;
    }
  }

  // Delete swap
  async deleteSwap(swapId) {
    try {
      const response = await fetch(`${this.baseURL}/admin/swaps/${swapId}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete swap');
      }

      return data;
    } catch (error) {
      console.error('Error deleting swap:', error);
      throw error;
    }
  }
}

export default new AdminService(); 