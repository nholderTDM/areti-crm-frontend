import axios from 'axios';

// Create axios instance with the correct base URL
const apiClient = axios.create({
  baseURL: process.env.NODE_ENV === 'production'
    ? '/api'
    : 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to attach the token to all requests
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

// Add response interceptor to log successes
apiClient.interceptors.response.use(
  response => {
    console.log('API Response success:', response.config.url);
    return response;
  },
  error => {
    console.error('API Response error:', error.config?.url, error.response?.status);
   
    // Only log the 401 error but DON'T clear auth data
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized access detected (401), but maintaining session');
    }
   
    return Promise.reject(error);
  }
);

// Define API endpoints for leads
export const LeadAPI = {
  getAll: () => apiClient.get('/leads'),
  getById: (id) => apiClient.get(`/leads/${id}`),
  create: (lead) => apiClient.post('/leads', lead),
  update: (id, lead) => apiClient.put(`/leads/${id}`, lead),
  delete: (id) => apiClient.delete(`/leads/${id}`),
  addNote: (id, note) => apiClient.post(`/leads/${id}/notes`, { note }),
  addTask: (id, task) => apiClient.post(`/leads/${id}/tasks`, task),
  updateTask: (leadId, taskId, updates) => apiClient.put(`/leads/${leadId}/tasks/${taskId}`, updates)
};

// Helper function to ensure token persistence
const ensureAuthPersistence = () => {
  try {
    // Check if we have a token in any format
    const token = localStorage.getItem('token');
    const authData = localStorage.getItem('app:auth');
   
    if (token && !authData) {
      // We have a standard token but no app:auth - create it
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : {};
      localStorage.setItem('app:auth', JSON.stringify({ token, user }));
      console.log('API client: Created app:auth from standard token');
    } else if (!token && authData) {
      // We have app:auth but no standard token - extract it
      try {
        const parsedAuth = JSON.parse(authData);
        if (parsedAuth.token) {
          localStorage.setItem('token', parsedAuth.token);
          console.log('API client: Created standard token from app:auth');
        }
      } catch (e) {
        console.error('Error parsing app:auth', e);
      }
    }
  } catch (e) {
    console.error('Error in ensureAuthPersistence', e);
  }
};

// Call this function when the module loads
ensureAuthPersistence();

// Set up an interval to check token persistence
setInterval(ensureAuthPersistence, 5000);

export default apiClient;