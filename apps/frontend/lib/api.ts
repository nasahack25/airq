import axios from 'axios';

// Create an Axios instance with default configuration
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, // Your Node.js backend URL
    withCredentials: true, // This is crucial for sending httpOnly cookies
});

export default api;
