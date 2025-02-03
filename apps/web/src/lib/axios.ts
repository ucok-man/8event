import axios from 'axios';

export const apiclient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  // timeout: 5000,
});
