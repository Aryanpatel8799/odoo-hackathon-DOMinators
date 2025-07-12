import { API_BASE_URL } from '../config';

class SwapService {
  constructor() {
    this.baseURL = API_BASE_URL || 'http://localhost:3000/api/v1';
  }

  // Get auth token from localStorage or cookies
  getAuthToken() {
    // Try to get token from localStorage first
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    if (token) {
      return token;
    }
    
    // Try to get from cookies
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'accessToken' || name === 'token') {
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

  // Create a new swap request
  async createSwap(requestedFromId, offeredSkill, wantedSkill) {
    try {
      const response = await fetch(`${this.baseURL}/swap/createSwap`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          requestedFromId,
          offeredSkill,
          wantedSkill,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create swap request');
      }

      return data;
    } catch (error) {
      console.error('Error creating swap:', error);
      throw error;
    }
  }

  // Get all swaps for the current user
  async getMySwaps(status = null) {
    try {
      let url = `${this.baseURL}/swap/listMySwaps`;
      if (status) {
        url += `?status=${status}`;
      }

      const response = await fetch(url, {
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

  // Accept a swap request
  async acceptSwap(swapId) {
    try {
      console.log('Attempting to accept swap:', swapId);
      console.log('Request URL:', `${this.baseURL}/swap/${swapId}/respond`);
      console.log('Headers:', this.getHeaders());
      
      const response = await fetch(`${this.baseURL}/swap/${swapId}/respond`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({
          action: 'accept',
        }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to accept swap');
      }

      return data;
    } catch (error) {
      console.error('Error accepting swap:', error);
      throw error;
    }
  }

  // Reject a swap request
  async rejectSwap(swapId) {
    try {
      console.log('Attempting to reject swap:', swapId);
      console.log('Request URL:', `${this.baseURL}/swap/${swapId}/respond`);
      console.log('Headers:', this.getHeaders());
      
      const response = await fetch(`${this.baseURL}/swap/${swapId}/respond`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({
          action: 'reject',
        }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reject swap');
      }

      return data;
    } catch (error) {
      console.error('Error rejecting swap:', error);
      throw error;
    }
  }

  // Cancel a swap request (only the creator can cancel)
  async cancelSwap(swapId) {
    try {
      const response = await fetch(`${this.baseURL}/swap/${swapId}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to cancel swap');
      }

      return data;
    } catch (error) {
      console.error('Error canceling swap:', error);
      throw error;
    }
  }

  // Mark a swap as completed
  async completeSwap(swapId) {
    try {
      const response = await fetch(`${this.baseURL}/swap/${swapId}/complete`, {
        method: 'PATCH',
        headers: this.getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to complete swap');
      }

      return data;
    } catch (error) {
      console.error('Error completing swap:', error);
      throw error;
    }
  }

  // Get all users for skill browsing
  async getUsers(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '' && value !== false) {
          queryParams.append(key, value);
        }
      });

      const url = `${this.baseURL}/user/users?${queryParams.toString()}`;
      
      const response = await fetch(url, {
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
      // No mock data fallback - let the error propagate
      throw error;
    }
  }

  // Get user profile by ID
  async getUserProfile(userId) {
    try {
      const response = await fetch(`${this.baseURL}/user/profile/${userId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user profile');
      }

      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }
}

export default new SwapService(); 