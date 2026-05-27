import { defineStore } from 'pinia'
import { useCookie } from '#app'
import { useApiFetch } from '~/utils/request'

interface User {
  id: string
  username: string
  email: string
}

interface AuthResponse {
  code: number
  data: AuthInfo
}

interface AuthInfo {
  access_token: string
  user: User
}

interface CommResponse {
  code: number
  data: any
}

const TOKEN_STORAGE_KEY = 'token'
const USER_STORAGE_KEY = 'user'
const TOKEN_EXPIRES_AT_STORAGE_KEY = 'token_expires_at'
const TOKEN_EXPIRE_SECONDS = 30 * 60
const TOKEN_EXPIRE_MS = TOKEN_EXPIRE_SECONDS * 1000

const createTokenExpiresAt = () => Date.now() + TOKEN_EXPIRE_MS

const readExpiresAt = (value: string | number | null | undefined) => {
  const expiresAt = Number(value)
  return Number.isFinite(expiresAt) ? expiresAt : 0
}

const isExpired = (expiresAt: number) => !expiresAt || Date.now() >= expiresAt

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as null | User,
    token: '' as string,
    tokenExpiresAt: 0 as number
  }),
  getters: {
    isLoggedIn: (state) => !!state.token && !isExpired(state.tokenExpiresAt)
  },
  actions: {
    saveAuth(token: string, user?: User | null) {
      const expiresAt = createTokenExpiresAt()
      this.token = token
      this.tokenExpiresAt = expiresAt
      if (user !== undefined) {
        this.user = user
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_STORAGE_KEY, token)
        localStorage.setItem(TOKEN_EXPIRES_AT_STORAGE_KEY, String(expiresAt))
        if (this.user) {
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(this.user))
        }
      }

      const cookieToken = useCookie<string | null>(TOKEN_STORAGE_KEY, { maxAge: TOKEN_EXPIRE_SECONDS })
      cookieToken.value = token
      const cookieTokenExpiresAt = useCookie<string | null>(TOKEN_EXPIRES_AT_STORAGE_KEY, { maxAge: TOKEN_EXPIRE_SECONDS })
      cookieTokenExpiresAt.value = String(expiresAt)
      const cookieUser = useCookie<string | null>(USER_STORAGE_KEY, { maxAge: TOKEN_EXPIRE_SECONDS })
      cookieUser.value = this.user ? JSON.stringify(this.user) : null
    },

    setToken(token: string) {
      this.saveAuth(token, this.user)
    },

    async login(username: string, password: string) {
      const res = await useApiFetch('/consumer/login', {
        method: 'POST',
        body: { username, password }
      }) as AuthResponse

      if (res.code == 200 && res.data.access_token && res.data.user) {
        this.saveAuth(res.data.access_token, res.data.user)
      }

      return res
    },

    async register(username: string, password: string, code: string, invitCode: string) {
      const res = await useApiFetch('/consumer/register', {
        method: 'POST',
        body: { username, password, code, invitCode }
      }) as AuthResponse

      if (res.code == 200 && res.data.access_token && res.data.user) {
        this.saveAuth(res.data.access_token, res.data.user)
      }

      return res
    },

    logout() {
      this.token = ''
      this.user = null
      this.tokenExpiresAt = 0

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
    },

    async fetchUser() {
      if (!this.initAuth()) {
        return { code: 401, data: null } as CommResponse
      }

      const res = await useApiFetch('/consumer/my', { method: 'GET' }) as CommResponse

      if (res.code != 200) {
        return res
      }

      this.user = res.data

      if (typeof window !== 'undefined') {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.data))
      }
      const cookieUser = useCookie<string | null>(USER_STORAGE_KEY, { maxAge: TOKEN_EXPIRE_SECONDS })
      cookieUser.value = JSON.stringify(res.data)

      return res
    },

    initAuth() {
      try {
        if (typeof window !== 'undefined') {
          const localToken = localStorage.getItem(TOKEN_STORAGE_KEY)
          const localUser = localStorage.getItem(USER_STORAGE_KEY)
          const localTokenExpiresAt = readExpiresAt(localStorage.getItem(TOKEN_EXPIRES_AT_STORAGE_KEY))

          if (localToken) {
            if (isExpired(localTokenExpiresAt)) {
              this.logout()
              return false
            }
            this.token = localToken
            this.tokenExpiresAt = localTokenExpiresAt
            if (localUser) {
              this.user = JSON.parse(localUser)
            }
            return true
          }
        }

        const cookieToken = useCookie<string | null>(TOKEN_STORAGE_KEY)
        const cookieUser = useCookie<string | null>(USER_STORAGE_KEY)
        const cookieTokenExpiresAt = useCookie<string | null>(TOKEN_EXPIRES_AT_STORAGE_KEY)
        const expiresAt = readExpiresAt(cookieTokenExpiresAt.value)

        if (cookieToken.value) {
          if (isExpired(expiresAt)) {
            this.logout()
            return false
          }
          this.token = cookieToken.value
          this.tokenExpiresAt = expiresAt
          if (cookieUser.value) {
            this.user = JSON.parse(cookieUser.value)
          }
          return true
        }
      } catch (e) {
        this.logout()
      }

      return false
    }
  }
})
