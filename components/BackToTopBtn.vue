<template>
  <a
    v-show="showButton"
    href="#"
    @click.prevent="scrollToTop"
    class="fixed bottom-8 right-8 z-[999] h-10 w-10 flex items-center justify-center rounded-md bg-yellow-500 text-white shadow-md transition duration-300 hover:bg-blue-800"
  >
    <span class="mt-[6px] h-3 w-3 rotate-45 border-l-2 border-t-2 border-white"></span>
  </a>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const showButton = ref(false)

const handleScroll = () => {
  showButton.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>