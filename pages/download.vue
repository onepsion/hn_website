<script setup lang="ts">
const localePath = useLocalePath()
await navigateTo(`${localePath('index')}#platforms`, { replace: true })
</script>

<template>
  <div class="site-shell py-20 text-center text-sm text-[color:var(--site-muted)]">
    正在跳转到客户端下载区域...
  </div>
</template>
