const API_BASE_URL = 'http://localhost:3000/api/v1/user';

class UserService {
  constructor() {
    this.baseURL = API_BASE_URL;
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

  // Common request method
  async makeRequest(endpoint, options = {}) {
    const token = this.getAuthToken();
    const url = `${this.baseURL}${endpoint}`;
    
    console.log('Making API request to:', url);
    console.log('Request options:', options);
    console.log('Auth token available:', !!token);
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Response is not JSON:', contentType);
        throw new Error(`Server returned ${response.status}: ${response.statusText}. Expected JSON but got ${contentType}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error('API Error for endpoint:', endpoint, error);
      
      // Check if it's a network error
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to server. Please check if the backend is running.');
      }
      
      // Check if it's a JSON parsing error
      if (error.message.includes('Unexpected token')) {
        throw new Error('Server error: Received invalid response. Please check if the backend is running correctly.');
      }
      
      throw error;
    }
  }

  // Get user profile
  async getUserProfile(userId = null) {
    try {
      const token = this.getAuthToken();
      // Use authenticated routes if we have a token, otherwise use dev routes
      const endpoint = userId ? 
        (token ? `/profile/${userId}` : `/dev/profile/${userId}`) : 
        (token ? '/profile' : '/dev/profile');
      console.log('Fetching user profile from:', endpoint);
      return await this.makeRequest(endpoint, { method: 'GET' });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Return mock data for development if API fails
      return {
        success: true,
        data: {
          name: "Test User",
          email: "test@example.com",
          profileIMG: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
          location: "San Francisco, CA",
          isPublic: true,
          skillsOffered: ["JavaScript", "React"],
          skillsWanted: ["Python", "Data Science"],
          about: "Passionate developer looking to learn and share skills.",
          availability: ["weekdays-evening", "weekends"],
          createdAt: new Date().toISOString(),
          stats: {
            completedSwaps: 5,
            averageRating: 4.5,
            reviewCount: 8
          }
        }
      };
    }
  }

  // Update basic profile info
  async updateProfile(profileData) {
    try {
      const formData = new FormData();
      
      // Add text fields
      Object.keys(profileData).forEach(key => {
        if (key !== 'avatar' && profileData[key] !== undefined) {
          formData.append(key, profileData[key]);
        }
      });

      // Add avatar file if present
      if (profileData.avatar instanceof File) {
        formData.append('avatar', profileData.avatar);
      }

      console.log('Updating profile with data:', profileData);
      
      const token = this.getAuthToken();
      const endpoint = token ? '/updateprofile' : '/dev/updateprofile';
      
      const response = await this.makeRequest(endpoint, {
        method: 'PATCH',
        headers: {}, // Let browser set content-type for FormData
        body: formData,
      });

      console.log('Profile update response:', response);
      return response;
    } catch (error) {
      console.error('Error updating profile:', error);
      
      // For development, simulate successful update if backend is not available
      if (error.message.includes('Network error') || error.message.includes('Server error')) {
        console.log('Backend not available, simulating successful update for development');
        return {
          success: true,
          data: {
            ...profileData,
            profileIMG: profileData.avatar instanceof File ? URL.createObjectURL(profileData.avatar) : profileData.avatar
          }
        };
      }
      
      throw error;
    }
  }

  // Update skills
  async updateSkills(skillsData) {
    try {
      console.log('Updating skills with data:', skillsData);
      
      const token = this.getAuthToken();
      const endpoint = token ? '/updateskills' : '/dev/updateskills';
      
      const response = await this.makeRequest(endpoint, {
        method: 'PATCH',
        body: JSON.stringify(skillsData),
      });

      console.log('Skills update response:', response);
      return response;
    } catch (error) {
      console.error('Error updating skills:', error);
      
      // For development, simulate successful update if backend is not available
      if (error.message.includes('Network error') || error.message.includes('Server error')) {
        console.log('Backend not available, simulating successful skills update for development');
        return {
          success: true,
          data: skillsData
        };
      }
      
      throw error;
    }
  }

  // Update about section
  async updateAbout(aboutData) {
    try {
      console.log('Updating about section with data:', aboutData);
      
      const token = this.getAuthToken();
      const endpoint = token ? '/updateabout' : '/dev/updateabout';
      
      const response = await this.makeRequest(endpoint, {
        method: 'PATCH',
        body: JSON.stringify(aboutData),
      });

      console.log('About update response:', response);
      return response;
    } catch (error) {
      console.error('Error updating about section:', error);
      
      // For development, simulate successful update if backend is not available
      if (error.message.includes('Network error') || error.message.includes('Server error')) {
        console.log('Backend not available, simulating successful about update for development');
        return {
          success: true,
          data: aboutData
        };
      }
      
      throw error;
    }
  }

  // Update availability
  async updateAvailability(availabilityData) {
    try {
      console.log('Updating availability with data:', availabilityData);
      
      const token = this.getAuthToken();
      const endpoint = token ? '/updateavailability' : '/dev/updateavailability';
      
      const response = await this.makeRequest(endpoint, {
        method: 'PATCH',
        body: JSON.stringify(availabilityData),
      });

      console.log('Availability update response:', response);
      return response;
    } catch (error) {
      console.error('Error updating availability:', error);
      
      // For development, simulate successful update if backend is not available
      if (error.message.includes('Network error') || error.message.includes('Server error')) {
        console.log('Backend not available, simulating successful availability update for development');
        return {
          success: true,
          data: availabilityData
        };
      }
      
      throw error;
    }
  }

  // Get current user
  async getCurrentUser() {
    return this.makeRequest('/getprofile', { method: 'POST' });
  }

  // Test backend connectivity
  async testBackendConnection() {
    try {
      const response = await fetch(`${this.baseURL}/dev/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Backend connection test:', response.status);
      return response.ok;
    } catch (error) {
      console.error('Backend connection test failed:', error);
      return false;
    }
  }
}

export default new UserService(); 