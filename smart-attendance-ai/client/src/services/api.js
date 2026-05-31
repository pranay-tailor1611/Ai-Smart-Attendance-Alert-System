import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password'];
      if (!publicPaths.some((p) => window.location.pathname.startsWith(p))) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  me: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

export const studentApi = {
  list: () => api.get('/students'),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  remove: (id) => api.delete(`/students/${id}`),
  get: (id) => api.get(`/students/${id}`),
};

export const attendanceApi = {
  mark: (data) => api.post('/attendance', data),
  bulk: (records) => api.post('/attendance/bulk', { records }),
  records: (params) => api.get('/attendance', { params }),
  my: () => api.get('/attendance/my'),
  stats: () => api.get('/attendance/stats'),
  today: () => api.get('/attendance/today'),
};

export const dashboardApi = {
  admin: () => api.get('/dashboard/admin'),
  faculty: () => api.get('/dashboard/faculty'),
  student: () => api.get('/dashboard/student'),
};

export const aiApi = {
  runWorkflow: (studentId) => api.post(`/ai/workflow/${studentId}`),
  runBulk: () => api.post('/ai/workflow/bulk'),
  alerts: (params) => api.get('/ai/alerts', { params }),
  markRead: (id) => api.patch(`/ai/alerts/${id}/read`),
  recommendations: (params) => api.get('/ai/recommendations', { params }),
};

export const reportApi = {
  list: () => api.get('/reports'),
  pdf: () => api.get('/reports/pdf', { responseType: 'blob' }),
  excel: () => api.get('/reports/excel', { responseType: 'blob' }),
};

export const userApi = {
  faculty: () => api.get('/users/faculty'),
  createFaculty: (data) => api.post('/users/faculty', data),
};

export default api;
