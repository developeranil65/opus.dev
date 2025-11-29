import axios from 'axios';

// Get the base URL from your .env file
const VITE_API_URL = import.meta.env.VITE_API_URL || '/api/v1';

const api = axios.create({
  baseURL: VITE_API_URL,
  withCredentials: true, // This is essential for sending cookies (like your auth token)
});

// You can add interceptors here later to handle token refreshing
// or global error handling.

export default api;