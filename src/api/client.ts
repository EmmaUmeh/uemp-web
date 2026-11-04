import axios, { AxiosError } from 'axios';
import { AUTH_EXPIRED_EVENT } from '../utils/constants';

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const fallbackMessages: Record<number, string> = {
  400: 'The request was invalid. Check your input and try again.',
  401: 'Your session has expired or your credentials are invalid.',
  403: 'You do not have permission to do this.',
  404: 'The requested resource was not found.',
  409: 'This record already exists.',
  422: 'Some fields are invalid. Check your input and try again.',
  500: 'The server ran into a problem. Try again shortly.',
};

interface ErrorBody {
  message?: string;
  error?: string;
}

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

client.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorBody>) => {
    if (!error.response) {
      const message =
        error.code === 'ECONNABORTED'
          ? 'The request timed out. Try again.'
          : 'Network error. Check your connection and try again.';
      return Promise.reject(new ApiError(message));
    }
    const { status, data } = error.response;
    if (status === 401) {
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }
    const message = data?.message ?? data?.error ?? fallbackMessages[status] ?? 'Something went wrong.';
    return Promise.reject(new ApiError(message, status));
  }
);

export default client;
