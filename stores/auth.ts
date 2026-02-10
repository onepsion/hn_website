// stores/auth.ts
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { useApiFetch } from '~/utils/request'
import { useCookie } from '#app'
const router = useRouter()

interface User {
  id: string
  username: string
  email: string
}

interface AuthResponse {
  code: number,
  data: AuthInfo
}

interface AuthInfo {
  access_token: string,
  user: User
}

interface CommResponse {
  code: number,
  data: any
}


export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as null | User,
    token: '' as string
  }),
  getters: {
    isLoggedIn: (state) => !!state.token
  },
  actions: {
    async setToken(token : string) {
        
      try {

         localStorage.setItem('token', token)
          const cookieToken = useCookie('token')
          cookieToken.value = token

      } catch(e) {

      }
       

        //this.fetchUser()
    },

    // 登录
    async login(username: string, password: string) {
      const res = await useApiFetch('/consumer/login', {
        method: 'POST',
        body: { username, password }
      }) as AuthResponse

      if (res.code == 200 && res.data.access_token && res.data.user) {
        this.token = res.data.access_token
        this.user = res.data.user

        // 保存到 localStorage（App模式）
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', this.token)
          localStorage.setItem('user', JSON.stringify(this.user))
        }

        // 保存到 cookie（浏览器静态站点可读）
        const cookieToken = useCookie('token')
        cookieToken.value = this.token
        const cookieUser = useCookie('user')
        cookieUser.value = JSON.stringify(this.user)
      }

      return res
    },

    async register(username: string, password: string, code: string, invitCode: string) {
      const res = await useApiFetch('/consumer/register', {
        method: 'POST',
        body: { "username":username, "password":password, "code":code, "invitCode":invitCode }
      }) as AuthResponse

      if (res.code == 200 && res.data.access_token && res.data.user) {
        this.token = res.data.access_token
        this.user = res.data.user

        // 保存到 localStorage（App模式）
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', this.token)
          localStorage.setItem('user', JSON.stringify(this.user))
        }

        // 保存到 cookie（浏览器静态站点可读）
        const cookieToken = useCookie('token')
        cookieToken.value = this.token
        const cookieUser = useCookie('user')
        cookieUser.value = JSON.stringify(this.user)
      }

      return res
    },

    // 登出
    logout() {
      this.token = ''
      this.user = null

      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }

      const cookieToken = useCookie('token')
      cookieToken.value = null
      const cookieUser = useCookie('user')
      cookieUser.value = null
    },

    // 获取个人信息
    async fetchUser() {
      const res = await useApiFetch('/consumer/my', { method: 'GET' }) as CommResponse

        if (res.code != 200) {
          return res;
        }
    
        this.user = res.data

        // 更新本地存储 / Cookie
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(res))
        }
        const cookieUser = useCookie('user')
        cookieUser.value = JSON.stringify(res)

        return res
    },

    // 初始化 token 和用户信息（页面刷新时调用）
    initAuth() {

      try {

        if (typeof window !== 'undefined') {
          var isExistToken = false as boolean;
          const localToken = localStorage.getItem('token')
          const localUser = localStorage.getItem('user')
          if (localToken) {
            this.token = localToken
            isExistToken = true
          } 
          if (localUser) {
            this.user = JSON.parse(localUser)
          }
          else {
            const cookieToken = useCookie('token')
            const cookieUser = useCookie('user')
            if (cookieToken.value) {
              this.token = cookieToken.value
              isExistToken = true
            }
            if (cookieUser.value) {
              this.user = JSON.parse(cookieUser.value)
            }
          }

          return isExistToken;
        }

      } catch(e) {

      }

      
    }
  }
})
