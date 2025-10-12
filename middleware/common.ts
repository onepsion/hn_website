// middleware/auth.ts
import { useAuthStore } from '~/stores/auth'
const auth = useAuthStore()

export default defineNuxtRouteMiddleware((to, from) => {
 
  
  const accessToken = to.query.access_token as string

  if (accessToken) {
      auth.setToken(accessToken)
  }

  auth.initAuth()

  //如果没有用户信息，并且访问的不是登录页
  if (!auth.isLoggedIn) {
    return navigateTo('/login')
  }
})
