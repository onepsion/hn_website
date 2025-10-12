<script setup lang="ts">
//const route = useRoute()
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const showHeader = computed(() => {
  return !route.name?.toString().includes('profile')
})

const authStore = useAuthStore()
// 页面加载时初始化登录状态
authStore.initAuth()

// if (process.client) {

//   const colorMode = useColorMode()
//   localStorage.setItem('nuxt-color-mode', colorMode.value)
// }





</script>

<template>
  <div>
    <AppHeader v-if="showHeader" :home="route.name?.toString().includes('index')" />

    <slot />
    <AppFooter v-if="showHeader"/>
  </div>

</template>