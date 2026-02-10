<template>
  <div id="app">
    <AppCoin />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()
//拦截判断页面是否需要登录才能访问
definePageMeta({
  layout: 'nohead',
  middleware: 'common'
})

onMounted(() => {

  const ua = navigator.userAgent
  
  var accessToken = route.query.access_token;
  if (accessToken) {
      const currentPath = route.path;
      router.replace({ path: currentPath });
  }

})

</script>
