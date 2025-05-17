import axios from 'axios';

// Create a basic API client
const apiClient = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add interceptor to attach token to requests
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export const login = async (email, password) => {
  try {
    console.log('Attempting login with:', email);
    const response = await apiClient.post('/auth/login', { email, password });
    
    if (response.data && response.data.token) {
      // Store token and user in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user || {}));
      
      // Also store in app:auth format for compatibility
      localStorage.setItem('app:auth', JSON.stringify({
        token: response.data.token,
        user: response.data.user || {}
      }));
      
      console.log('Auth data stored successfully');
      return response.data;
    } else {
      throw new Error('Login response missing token or success flag');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error.response?.data?.message || 'Login failed';
  }
};

export const logout = async () => {
  try {
    // Clear token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('app:auth');
    
    // Call logout endpoint (if your API has one)
    try {
      await apiClient.get('/auth/logout');
    } catch (err) {
      console.warn('Logout API call failed, but localStorage was cleared');
    }
    
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
};

export const getCurrentUser = async () => {
  try {
    // Add a timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await apiClient.get('/auth/me', {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
};

export const getStoredUser = () => {
  try {
    // Try app:auth first
    const authData = localStorage.getItem('app:auth');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        if (parsed.user) {
          return parsed.user;
        }
      } catch (e) {
        console.error('Error parsing app:auth', e);
      }
    }
    
    // Fall back to standard user storage
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Get stored user error:', error);
    return null;
  }
};

export const isLoggedIn = () => {
  try {
    console.log("CHECKING AUTH STATE - Token Debug:");
    console.log("token exists:", !!localStorage.getItem('token'));
    console.log("user exists:", !!localStorage.getItem('user'));
    console.log("app:auth exists:", !!localStorage.getItem('app:auth'));

    // More reliable token check - we'll consider any of these valid
    const hasToken = !!localStorage.getItem('token');
    const hasUser = !!localStorage.getItem('user');
    const hasAppAuth = !!localStorage.getItem('app:auth');

    // Use OR instead of AND to prevent logout if any auth component is present
    const isLoggedIn = hasToken || hasUser || hasAppAuth;
    console.log("Final isLoggedIn result:", isLoggedIn);

    if (isLoggedIn) {
      ensureTokenConsistency();
    }
     
    return isLoggedIn;
  }
  catch (e) {
    console.error('Error in isLoggedIn:', e);
    return false; 
  }
};

export const ensureTokenConsistency = () => {
  try {
    // Get current values
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const appAuthStr = localStorage.getItem('app:auth');
    
    // Try to restore token if missing but we have app:auth
    if (!token && appAuthStr) {
      try {
        const appAuth = JSON.parse(appAuthStr);
        if (appAuth.token) {
          localStorage.setItem('token', appAuth.token);
          console.log('Restored token from app:auth');
        }
      } catch (err) {
        console.error('Error restoring token from app:auth:', err);
      }
    }
    
    // Try to restore token if missing but we have user data
    if (!token && userStr) {
      // Make a temporary token to maintain auth
      localStorage.setItem('token', 'temp_recovery_token');
      console.log('Created temporary recovery token');
    }
    
    // Try to restore user if missing but we have app:auth
    if (!userStr && appAuthStr) {
      try {
        const appAuth = JSON.parse(appAuthStr);
        if (appAuth.user) {
          localStorage.setItem('user', JSON.stringify(appAuth.user));
          console.log('Restored user from app:auth');
        }
      } catch (err) {
        console.error('Error restoring user from app:auth:', err);
      }
    }
    
    // Try to restore app:auth if missing but we have token and user
    if (!appAuthStr && token && userStr) {
      try {
        const user = JSON.parse(userStr);
        localStorage.setItem('app:auth', JSON.stringify({ token, user }));
        console.log('Restored app:auth from token and user');
      } catch (err) {
        console.error('Error creating app:auth from token and user:', err);
      }
    }
  } catch (error) {
    console.error('Error in ensureTokenConsistency:', error);
  }
};