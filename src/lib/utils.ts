import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import instance from "./axiosInterceptors"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('authToken', token)
    instance.defaults.headers.Authorization = `Bearer ${token}`
  } else {
    localStorage.removeItem('authToken')
    delete instance.defaults.headers.Authorization
  }
}

export const getSessionToken = () => {
  return localStorage.getItem('authToken')
}