import axios from 'axios'
import { API_URL, ROUTES } from '@/config-global'
import { getSessionToken } from './utils'

const instance = axios.create({
  baseURL: API_URL,
})

instance.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response?.status === 401) {
      const errorMessage = error.response?.data?.message || 'Unauthorized access';
      
      console.log('🚫 401 Error Details:', {
        status: error.response.status,
        message: errorMessage,
        url: error.config?.url,
        headers: error.config?.headers
      });
      
      if (errorMessage.includes('expired') || errorMessage.includes('Invalid')) {
        console.warn('Session expired - redirecting to login.')
      } else {
        console.warn('Unauthorized access - token might be invalid or expired.')
      }
      
      localStorage.removeItem('authToken')
      if (window.location.pathname !== ROUTES.AUTH.LOGIN) {
        window.location.href = window.location.origin + ROUTES.AUTH.LOGIN
      }
    }

    return Promise.reject(error)
  },
)

instance.interceptors.request.use(
  config => {
    const token = getSessionToken()
    if (token) {
      console.log('🔑 Token being sent:', token?.substring(0, 20) + '...')
      config.headers.Authorization = `Bearer ${token}`
    } else {
      console.warn('⚠️ No token found in localStorage')
    }
    return config
  },
  error => Promise.reject(error),
)

export default instance
