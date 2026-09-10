import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ✅ Public API instance (NO token interceptor)
const publicApiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Authenticated API instance (WITH token interceptor)
const authApiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token (ONLY for auth client)
authApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`🔵 AUTH Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Add logging to public API requests
publicApiClient.interceptors.request.use(
  (config) => {
    console.log(`🟢 PUBLIC Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors (for both)
const handleResponseError = (error) => {
  console.error('❌ API Error:', error.response?.status, error.response?.data);
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
  return Promise.reject(error);
};

// Response interceptor for public API with logging
publicApiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ PUBLIC Response from ${response.config.url}:`, response.data);
    return response;
  },
  handleResponseError
);

authApiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ AUTH Response from ${response.config.url}:`, response.data);
    return response;
  },
  handleResponseError
);

// Helper to extract data from response
const extractData = (response) => {
  if (!response) return null;
  if (response.data?.data !== undefined) return response.data.data;
  if (response.data !== undefined) return response.data;
  return response;
};

// ============ AUTH ENDPOINTS (Uses authApiClient) ============
export const auth = {
  register: (data) => authApiClient.post('/auth/register', data),
  login: (data) => authApiClient.post('/auth/login', data),
  logout: () => authApiClient.post('/auth/logout'),
  getMe: () => authApiClient.get('/auth/me'),
  createMember: (data) => authApiClient.post('/auth/admin/create-member', data),
};

// ============ MEMBER ENDPOINTS (Uses authApiClient) ============
export const members = {
  getAll: (params) => authApiClient.get('/members', { params }),
  getStats: () => authApiClient.get('/members/stats'),
  getProfile: () => authApiClient.get('/members/me/profile'),
  updateProfile: (data) => authApiClient.put('/members/me/profile', data),
  getById: (id) => authApiClient.get(`/members/${id}`),
  updateStatus: (id, status) => authApiClient.put(`/members/${id}/status`, { status }),
  updateRole: (id, spiritualRole) => authApiClient.put(`/members/${id}/role`, { spiritualRole }),
  delete: (id) => authApiClient.delete(`/members/${id}`),
};

// ============ DONATION ENDPOINTS (Uses authApiClient) ============
export const donations = {
  submit: (data) => authApiClient.post('/donations', data),
  getAll: (params) => authApiClient.get('/donations', { params }),
  getMyDonations: (params) => authApiClient.get('/donations/my-donations', { params }),
  getPending: () => authApiClient.get('/donations/pending'),
  getStats: () => authApiClient.get('/donations/stats'),
  getById: (id) => authApiClient.get(`/donations/${id}`),
  verify: (id, data) => authApiClient.put(`/donations/${id}/verify`, data),
  reject: (id, data) => authApiClient.put(`/donations/${id}/reject`, data),
};

// ============ EVENT ENDPOINTS (Uses authApiClient) ============
export const events = {
  getAll: (params) => authApiClient.get('/events', { params }),
  getUpcoming: () => authApiClient.get('/events/upcoming'),
  getById: (id) => authApiClient.get(`/events/${id}`),
  create: (data) => authApiClient.post('/events', data),
  update: (id, data) => authApiClient.put(`/events/${id}`, data),
  delete: (id) => authApiClient.delete(`/events/${id}`),
};

// ============ BLOG ENDPOINTS (Uses authApiClient) ============
export const blog = {
  getAll: (params) => authApiClient.get('/blog', { params }),
  getPublished: (params) => authApiClient.get('/blog/published', { params }),
  getFeatured: () => authApiClient.get('/blog/featured'),
  getBySlug: (slug) => authApiClient.get(`/blog/${slug}`),
  getById: (id) => authApiClient.get(`/blog/id/${id}`),
  create: (data) => authApiClient.post('/blog', data),
  update: (id, data) => authApiClient.put(`/blog/${id}`, data),
  delete: (id) => authApiClient.delete(`/blog/${id}`),
};

// ============ SERMON ENDPOINTS ============
export const sermons = {
  getAll: (params) => authApiClient.get('/sermons', { params }),
  getPublic: (params) => authApiClient.get('/sermons/public', { params }),
  getById: (id) => authApiClient.get(`/sermons/${id}`),
  create: (data) => authApiClient.post('/sermons', data),
  update: (id, data) => authApiClient.put(`/sermons/${id}`, data),
  delete: (id) => authApiClient.delete(`/sermons/${id}`),
  incrementDownloads: (id) => authApiClient.post(`/sermons/${id}/download`),
};

// ============ NOTIFICATION ENDPOINTS (Uses authApiClient) ============
export const notifications = {
  getAll: (params) => authApiClient.get('/notifications', { params }),
  getUnreadCount: () => authApiClient.get('/notifications/unread/count'),
  markAsRead: (id) => authApiClient.put(`/notifications/${id}/read`),
  markAllAsRead: () => authApiClient.put('/notifications/read-all'),
  delete: (id) => authApiClient.delete(`/notifications/${id}`),
};

// ============ SERVICE ENDPOINTS (Uses authApiClient) ============
export const services = {
  getAll: (params) => authApiClient.get('/services', { params }),
  getById: (id) => authApiClient.get(`/services/${id}`),
  create: (data) => authApiClient.post('/services', data),
  update: (id, data) => authApiClient.put(`/services/${id}`, data),
  delete: (id) => authApiClient.delete(`/services/${id}`),
  // NEW: Image management endpoints
  addImage: (id, data) => authApiClient.post(`/services/${id}/images`, data),
  removeImage: (id, imageId) => authApiClient.delete(`/services/${id}/images/${imageId}`),
  // NEW: Service stats
  getStats: () => authApiClient.get('/services/stats/overview'),
};

// ============ PUBLIC ENDPOINTS (Uses publicApiClient - NO token) ============
export const publicApi = {
  getHistory: () => publicApiClient.get('/public/history').then(extractData),
  getServices: () => publicApiClient.get('/public/services').then(extractData),
  getServiceById: (id) => publicApiClient.get(`/public/services/${id}`).then(extractData), // ← NEW
  getWhatWeDo: () => publicApiClient.get('/public/what-we-do').then(extractData),
  getContact: () => publicApiClient.get('/public/contact').then(extractData),
  getHomepage: () => publicApiClient.get('/public/homepage').then(extractData),
  getTestimonies: () => publicApiClient.get('/public/testimonies').then(extractData),
  submitContact: (data) => publicApiClient.post('/public/contact/submit', data).then(extractData),
};

// Export the clients if needed elsewhere
export const publicClient = publicApiClient;
export const authClient = authApiClient;

export default authApiClient;