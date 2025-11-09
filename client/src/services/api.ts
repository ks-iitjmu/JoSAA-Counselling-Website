import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token if available
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user');
    if (user) {
      // If you implement JWT tokens, add them here
      // const userData = JSON.parse(user);
      // config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authAPI = {
  login: (identifier: string, password: string) => 
    api.post('/auth/login', { identifier, password }),
  register: (role: string, userData: any) => 
    api.post('/auth/register', { role, ...userData }),
  logout: () => api.post('/auth/logout'),
  getProfile: (userID: number) => api.get(`/auth/profile/${userID}`),
  updateProfile: (userID: number, updates: any) => 
    api.put(`/auth/profile/${userID}`, updates),
  changePassword: (userID: number, currentPassword: string, newPassword: string) => 
    api.put(`/auth/password/${userID}`, { currentPassword, newPassword }),
  checkIdentifier: (type: string, value: string) => 
    api.get(`/auth/check?type=${type}&value=${value}`),
};

// Helper functions for authentication
export const login = async (identifier: string, password: string) => {
  const response = await authAPI.login(identifier, password);
  return response.data;
};

export const register = async (role: string, userData: any) => {
  const response = await authAPI.register(role, { ...userData, password: userData.password });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('isAuthenticated');
  return authAPI.logout();
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

// Candidate APIs
export const candidateAPI = {
  getAll: () => api.get('/candidates'),
  getById: (id: number) => api.get(`/candidates/${id}`),
  getWithAllocation: (id: number) => api.get(`/candidates/${id}/allocation`),
  create: (data: any) => api.post('/candidates', data),
  update: (id: number, data: any) => api.put(`/candidates/${id}`, data),
  delete: (id: number) => api.delete(`/candidates/${id}`),
};

// Institute APIs
export const instituteAPI = {
  getAll: () => api.get('/institutes'),
  getByCode: (code: string) => api.get(`/institutes/${code}`),
  getWithPrograms: () => api.get('/institutes/with-programs'),
  getProgramsByInstitute: (code: string) => api.get(`/institutes/${code}/programs`),
  create: (data: any) => api.post('/institutes', data),
  update: (code: string, data: any) => api.put(`/institutes/${code}`, data),
  delete: (code: string) => api.delete(`/institutes/${code}`),
};

// Choice List APIs
export const choiceAPI = {
  getByCandidate: (candidateId: number) => api.get(`/choices/candidate/${candidateId}`),
  add: (data: any) => api.post('/choices', data),
  updateOrder: (choiceId: number, newChoiceNumber: number) => 
    api.put(`/choices/${choiceId}/order`, { newChoiceNumber }),
  reorder: (candidateId: number, choices: any[]) => 
    api.post('/choices/reorder', { candidateId, choices }),
  lock: (candidateId: number, lockStatus: boolean) => 
    api.post('/choices/lock', { candidateId, lockStatus }),
  delete: (choiceId: number) => api.delete(`/choices/${choiceId}`),
  deleteAll: (candidateId: number) => api.delete(`/choices/candidate/${candidateId}/all`),
};

// Allocation APIs
export const allocationAPI = {
  getAll: () => api.get('/allocations'),
  getByCandidate: (candidateId: number) => api.get(`/allocations/candidate/${candidateId}`),
  getByRound: (roundId: number) => api.get(`/allocations/round/${roundId}`),
  create: (data: any) => api.post('/allocations', data),
  updateFeeStatus: (allocationId: number, status: string) => 
    api.put(`/allocations/${allocationId}/fee-status`, { status }),
};

// Program APIs
export const programAPI = {
  getAll: () => api.get('/programs'),
  getByCode: (code: string) => api.get(`/programs/${code}`),
  create: (data: any) => api.post('/programs', data),
};

// Seat Matrix APIs
export const seatMatrixAPI = {
  getAll: () => api.get('/seat-matrix'),
  getByInstitute: (instituteCode: string) => api.get(`/seat-matrix/institute/${instituteCode}`),
  create: (data: any) => api.post('/seat-matrix', data),
};

// Opening Closing Ranks APIs
export const ranksAPI = {
  getAll: () => api.get('/opening-closing-ranks'),
  getByRound: (roundId: number) => api.get(`/opening-closing-ranks/round/${roundId}`),
  searchByRank: (rank: number, category: string) => 
    api.get(`/opening-closing-ranks/search?rank=${rank}&category=${category}`),
  create: (data: any) => api.post('/opening-closing-ranks', data),
};

// Counselling Round APIs
export const counsellingRoundAPI = {
  getAll: () => api.get('/counselling-rounds'),
  getCurrent: () => api.get('/counselling-rounds/current'),
  create: (data: any) => api.post('/counselling-rounds', data),
};

export default api;
