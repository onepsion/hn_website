<script setup lang="ts">
const localePath = useLocalePath()
await navigateTo(`${localePath('login')}?tab=register`, { replace: true })
</script>

<template>
  <div class="site-shell py-20 text-center text-sm text-[color:var(--site-muted)]">
    正在跳转到注册页面...
  </div>
</template>
