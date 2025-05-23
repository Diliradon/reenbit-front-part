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
      console.warn('Unauthorized access - token might be invalid or expired.')
      localStorage.removeItem('token')
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
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error),
)

export default instance
