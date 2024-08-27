import axios from 'axios';

const BASE_URL = "http://localhost:8080"

// Create an Axios instance
const apiPrivateClient = axios.create({
  baseURL: BASE_URL,
});

// Create public Axios instance
export const apiPublicClient = axios.create({
  baseURL: BASE_URL,
});

// Add a request interceptor
apiPrivateClient.interceptors.request.use(
  (config) => {
    // Retrieve the token from local storage
    const token = localStorage.getItem('jwt');
    if (token) {
      // Attach the token to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiPrivateClient;