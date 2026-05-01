<script setup lang="ts">
import { Dialog, DialogPanel } from '@headlessui/vue'
import {
  ArrowRightIcon,
  Bars3Icon,
  CloudArrowDownIcon,
  MoonIcon,
  SunIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '~/stores/auth'

defineProps<{
  home?: boolean
}>()

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
const mobileMenuOpen = ref(false)
const activeNavKey = ref('home')

const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()
const authStore = useAuthStore()

const homePath = computed(() => localePath('index'))

const navLinks = computed(() => [
  { key: 'home', label: '首页', sectionId: '' },
  { key: 'features', label: '核心优势', sectionId: 'features' },
  { key: 'platforms', label: '客户端下载', sectionId: 'platforms' },
  { key: 'faq', label: '常见问题', sectionId: 'faq' },
])

const brandLink = computed(() => homePath.value)

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

watch(
  () => route.fullPath,
  () => {
    closeMobileMenu()
  }
)

const setActiveNavFromRoute = () => {
  if (route.path !== homePath.value) {
    activeNavKey.value = ''
    return
  }

  const hash = route.hash.replace('#', '')
  activeNavKey.value = hash || 'home'
}

watch(
  () => [route.path, route.hash, homePath.value],
  () => {
    setActiveNavFromRoute()
  },
  { immediate: true }
)

const scrollToSection = (sectionId?: string) => {
  if (!process.client) {
    return
  }

  if (!sectionId) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  const target = document.getElementById(sectionId)
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const navigateToNav = async (item: { key: string; sectionId: string }) => {
  closeMobileMenu()
  activeNavKey.value = item.key

  if (item.key === 'home') {
    await router.push(homePath.value).catch(() => undefined)
    requestAnimationFrame(() => {
      scrollToSection()
    })
    return
  }

  await router.push({
    path: homePath.value,
    hash: `#${item.sectionId}`,
  }).catch(() => undefined)

  requestAnimationFrame(() => {
    scrollToSection(item.sectionId)
  })
}

const isNavActive = (key: string) => activeNavKey.value === key

const toggleDarkMode = () => {
  const nextMode = colorMode.value === 'dark' ? 'light' : 'dark'
  colorMode.preference = nextMode
  colorMode.value = nextMode

  if (process.client) {
    localStorage.setItem('nuxt-color-mode', nextMode)
  }
}

const goDashboard = () => {
  closeMobileMenu()

  if (authStore.isLoggedIn) {
    router.push('/profile/person')
    return
  }

  router.push(localePath('login'))
}
</script>

<template>
  <header class="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
    <nav
      class="site-shell glass-panel flex items-center justify-between rounded-[28px] px-4 py-3 sm:px-6"
      aria-label="主导航"
    >
      <NuxtLink :to="brandLink" class="flex items-center gap-3">
        <span
          class="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/60 bg-white/80 shadow-[0_12px_30px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-slate-900/70"
        >
          <img src="@/assets/logo/logo.png" alt="黄鸟加速器 Logo" class="h-8 w-auto" />
        </span>
        <span class="hidden sm:block">
          <span class="block text-xs font-semibold tracking-[0.08em] text-amber-600 dark:text-amber-300">
            官方客户端
          </span>
          <span class="block text-base font-semibold text-[color:var(--site-text)]">黄鸟加速器</span>
        </span>
      </NuxtLink>

      <div class="hidden items-center gap-1 lg:flex">
        <button
          v-for="item in navLinks"
          :key="item.key"
          type="button"
          class="rounded-xl px-4 py-2 text-sm font-medium transition"
          :class="isNavActive(item.key)
            ? 'bg-amber-400/15 text-amber-600 dark:bg-amber-400/12 dark:text-amber-300'
            : 'text-[color:var(--site-muted)] hover:bg-slate-100 hover:text-[color:var(--site-text)] dark:hover:bg-white/5'"
          @click="navigateToNav(item)"
        >
          {{ item.label }}
        </button>
      </div>

      <div class="hidden items-center gap-3 lg:flex">
        <button
          type="button"
          class="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[color:var(--site-line)] bg-white text-[color:var(--site-text)] transition hover:-translate-y-0.5 hover:border-amber-400/60 hover:text-amber-600 dark:bg-slate-900/70 dark:hover:text-amber-300"
          aria-label="切换明暗模式"
          @click="toggleDarkMode"
        >
          <MoonIcon v-if="isDark" class="h-5 w-5" />
          <SunIcon v-else class="h-5 w-5" />
        </button>

        <button type="button" class="brand-button-secondary !rounded-xl" @click="navigateToNav(navLinks[2])">
          <CloudArrowDownIcon class="h-5 w-5" />
          下载客户端
        </button>

        <button type="button" class="brand-button !rounded-xl" @click="goDashboard">
          进入后台
          <ArrowRightIcon class="h-5 w-5" />
        </button>
      </div>

      <div class="flex items-center gap-2 lg:hidden">
        <button
          type="button"
          class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[color:var(--site-line)] bg-white text-[color:var(--site-text)] dark:bg-slate-900/70"
          aria-label="切换明暗模式"
          @click="toggleDarkMode"
        >
          <MoonIcon v-if="isDark" class="h-5 w-5" />
          <SunIcon v-else class="h-5 w-5" />
        </button>

        <button
          type="button"
          class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[color:var(--site-line)] bg-white text-[color:var(--site-text)] dark:bg-slate-900/70"
          aria-label="打开菜单"
          @click="mobileMenuOpen = true"
        >
          <Bars3Icon class="h-5 w-5" />
        </button>
      </div>
    </nav>

    <Dialog :open="mobileMenuOpen" class="lg:hidden" @close="mobileMenuOpen = false">
      <div class="fixed inset-0 z-50 bg-slate-950/35 backdrop-blur-sm" />
      <DialogPanel class="fixed inset-y-0 right-0 z-50 w-full max-w-sm p-4">
        <div class="glass-panel h-full rounded-[30px] p-6">
          <div class="flex items-center justify-between">
            <NuxtLink :to="brandLink" class="flex items-center gap-3" @click="closeMobileMenu">
              <span
                class="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/60 bg-white/80 dark:border-white/10 dark:bg-slate-900/70"
              >
                <img src="@/assets/logo/logo.png" alt="黄鸟加速器 Logo" class="h-8 w-auto" />
              </span>
              <div>
                <span class="block text-xs font-semibold tracking-[0.08em] text-amber-600 dark:text-amber-300">官方客户端</span>
                <span class="text-base font-semibold text-[color:var(--site-text)]">黄鸟加速器</span>
              </div>
            </NuxtLink>

            <button
              type="button"
              class="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[color:var(--site-line)] bg-white/80 text-[color:var(--site-text)] dark:bg-slate-900/70"
              aria-label="关闭菜单"
              @click="mobileMenuOpen = false"
            >
              <XMarkIcon class="h-5 w-5" />
            </button>
          </div>

          <div class="mt-8 space-y-3">
            <button
              v-for="item in navLinks"
              :key="item.key"
              type="button"
              class="surface-card flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium"
              :class="isNavActive(item.key)
                ? 'border-amber-400/40 bg-amber-400/10 text-amber-600 dark:text-amber-300'
                : 'text-[color:var(--site-text)]'"
              @click="navigateToNav(item)"
            >
              <span>{{ item.label }}</span>
              <ArrowRightIcon class="h-4 w-4 text-amber-500" />
            </button>
          </div>

          <div class="mt-8 space-y-3">
            <button type="button" class="brand-button-secondary w-full justify-center" @click="navigateToNav(navLinks[2])">
              <CloudArrowDownIcon class="h-5 w-5" />
              下载客户端
            </button>

            <button type="button" class="brand-button w-full justify-center" @click="goDashboard">
              进入后台
              <ArrowRightIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  </header>
</template>
