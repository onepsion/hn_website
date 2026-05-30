<template>
  <main class="min-h-screen py-6 sm:py-10">
    <div class="site-shell">
      <div class="mb-5 flex items-center justify-between gap-3">
        <button type="button" class="brand-button-secondary" @click="$router.push('/profile/person')">
          返回个人中心
        </button>
      </div>
      <AppLottery />
    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'common'
})
</script>
