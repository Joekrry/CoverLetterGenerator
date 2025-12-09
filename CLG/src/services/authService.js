const API_BASE_URL = 'https://coverbe.onrender.com/api/v1';

export const authService = {
  async register(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    return data;
  },

  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    return data;
  },

  async refreshToken(refreshToken) {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Token refresh failed');
    }

    return data;
  },

  // Token storage helpers
  saveTokens(tokens) {
    localStorage.setItem('access_token', tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
    localStorage.setItem('token_expires_in', tokens.expires_in.toString());
    localStorage.setItem('token_created_at', Date.now().toString());
  },

  getAccessToken() {
    return localStorage.getItem('access_token');
  },

  getRefreshToken() {
    return localStorage.getItem('refresh_token');
  },

  clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_expires_in');
    localStorage.removeItem('token_created_at');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_id');
  },

  isTokenExpired() {
    const expiresIn = localStorage.getItem('token_expires_in');
    const createdAt = localStorage.getItem('token_created_at');
    
    if (!expiresIn || !createdAt) return true;
    
    const expirationTime = parseInt(createdAt) + (parseInt(expiresIn) * 1000);
    return Date.now() >= expirationTime;
  },

  getUser() {
    const email = localStorage.getItem('user_email');
    const id = localStorage.getItem('user_id');
    if (email && id) {
      return { email, id };
    }
    return null;
  },
};

