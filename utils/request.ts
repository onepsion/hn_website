// utils/request.ts
import { useCookie, useRuntimeConfig } from '#app'

const TOKEN_STORAGE_KEY = 'token'
const USER_STORAGE_KEY = 'user'
const TOKEN_EXPIRES_AT_STORAGE_KEY = 'token_expires_at'

const clearAuth = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    localStorage.removeItem(USER_STORAGE_KEY)
    localStorage.removeItem(TOKEN_EXPIRES_AT_STORAGE_KEY)
  }
  const cookieToken = useCookie<string | null>(TOKEN_STORAGE_KEY)
  cookieToken.value = null
  const cookieUser = useCookie<string | null>(USER_STORAGE_KEY)
  cookieUser.value = null
  const cookieTokenExpiresAt = useCookie<string | null>(TOKEN_EXPIRES_AT_STORAGE_KEY)
  cookieTokenExpiresAt.value = null
}

export const useApiFetch = async (url: string, options: any = {}) => {
  const config = useRuntimeConfig()
  let token: string | null = null

  if (typeof window !== 'undefined') {
    token = localStorage.getItem(TOKEN_STORAGE_KEY) || null
    let expiresAt = Number(localStorage.getItem(TOKEN_EXPIRES_AT_STORAGE_KEY) || 0)
    if (!token || !expiresAt) {
      const cookieToken = useCookie<string | null>(TOKEN_STORAGE_KEY)
      const cookieTokenExpiresAt = useCookie<string | null>(TOKEN_EXPIRES_AT_STORAGE_KEY)
      token = cookieToken.value
      expiresAt = Number(cookieTokenExpiresAt.value || 0)
    }
    if (token && (!Number.isFinite(expiresAt) || Date.now() >= expiresAt)) {
      clearAuth()
      token = null
    }
  }

  const { body, headers, ...rest } = options

  return await $fetch(url, {
    baseURL: config.public.apiBase,
    credentials: 'include', // 带 Cookie
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? body : undefined, // 直接传对象，$fetch 会自动 JSON.stringify
    ...rest
  })
}
