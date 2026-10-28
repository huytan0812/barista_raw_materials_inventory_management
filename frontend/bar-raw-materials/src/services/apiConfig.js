// Backend base URL, configured through VITE_API_BASE_URL (see .env.example)
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/+$/, '');
export const API_URL = `${API_BASE_URL}/api`;
