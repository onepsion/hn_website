// utils/request.ts
import { useCookie, useRuntimeConfig } from '#app'

export const useApiFetch = async (url: string, options: any = {}) => {
  const config = useRuntimeConfig()
  let token: string | null = null

  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token') || null
    if (!token) {
      const cookieToken = useCookie<string | null>('token')
      token = cookieToken.value
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
