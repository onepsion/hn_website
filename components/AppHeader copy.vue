<template>
  <div class="bg-white/80 dark:bg-gray-900/90 shadow-sm sticky top-0 z-50 pl-20 pr-20 pt-2 pb-2"> <!-- 修改了 dark:bg -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- 左侧 Logo 和主菜单 -->
        <div class="flex items-center">
          <!-- Logo -->
          <a href="/" class="flex items-center">
            <span class="text-2xl font-bold text-gray-700 dark:text-gray-300">SaaSify</span>
          </a>

          <!-- 桌面端导航菜单 -->
          <nav class="hidden md:flex ml-60 space-x-8 font-bold">
            <a 
              v-for="item in navItems" 
              :key="item.name" 
              :href="item.href"
              class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'text-primary-600 dark:text-primary-400 font-semibold': item.current }"
            >
              {{ $t(item.name) }}
            </a>
          </nav>
          
        </div>

        <!-- 右侧功能区 -->
        <div class="lang-toggle flex items-center space-x-4">
          <!-- 暗黑模式切换按钮 -->
          <button 
            @click="toggleDarkMode"
            class="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            <MoonIcon v-if="isDarkMode" class="h-5 w-5" />
            <SunIcon v-else class="h-5 w-5" />
          </button>

          <!-- 多语言切换 -->
          <div class="relative" >
            <button 
              @click.stop="toggleLanguageDropdown"
              class="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <GlobeAltIcon class="h-5 w-5" />
              <span class="ml-1 text-sm">{{ selectedLocale.toUpperCase() }}</span>
              <ChevronDownIcon class="ml-1 h-4 w-4" />
            </button>

            <!-- 语言下拉菜单 -->
            <div 
              v-show="languageDropdownOpen"
              v-click-outside="closeLanguageDropdown"
              class="dropdown-menu absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700"
            >
              <a 
                v-for="locale in languages"
                :key="locale.code"
                href="#"
                @click.prevent="changeLanguage(locale)"
                class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {{ locale.name }}
              </a>
            </div>
          </div>

          <!-- 登录/注册按钮 -->
          <div class="hidden md:flex items-center space-x-2">
            <a 
              href="/login"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              登录
            </a>
            <!-- <a 
              href="/signup"
              class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors shadow-sm"
            >
              免费试用
            </a> -->
          </div>

          <!-- 移动端菜单按钮 -->
          <button 
            @click="toggleMobileMenu"
            class="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none"
          >
            <Bars3Icon class="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- 移动端菜单 (滑动面板) -->
    <div 
      v-show="mobileMenuOpen"
      class="md:hidden bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-800"
    >
      <div class="px-2 pt-2 pb-3 space-y-1">
        <a 
          v-for="item in navItems"
          :key="item.name"
          :href="item.href"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {{ item.name }}
        </a>
        <div class="pt-4 border-t border-gray-200 dark:border-gray-800">
          <a 
            href="/login"
            class="block w-full px-4 py-2 text-center text-sm font-medium border-gray-200 dark:text-white"
          >
            登录
          </a>
          <a 
            href="/signup"
            class="block w-full mt-2 px-4 py-2 text-center text-sm font-medium border-gray-200 dark:text-white rounded-md hover:bg-primary-700"
          >
            免费试用
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, watch } from 'vue'
import { 
  Bars3Icon, 
  GlobeAltIcon, 
  ChevronDownIcon,
  MoonIcon,
  SunIcon
} from '@heroicons/vue/24/outline'

// 暗黑模式状态
const isDarkMode = ref(false)

import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import { useLocalePath } from '#imports'


const { locale, locales } = useI18n()
const router = useRouter()
const route = useRoute()
const localePath = useLocalePath()

const selectedLocale = ref(locale.value)

// 同步 locale 状态
watch(locale, (newLocale) => {
  selectedLocale.value = newLocale
})


// 初始化时检查系统偏好或本地存储
onMounted(() => {
  const savedMode = localStorage.getItem('darkMode')
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  isDarkMode.value = savedMode ? savedMode === 'true' : systemPrefersDark
  updateDarkModeClass()
})

// 切换暗黑模式
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('darkMode', isDarkMode.value.toString())
  updateDarkModeClass()
}

// 更新HTML class
const updateDarkModeClass = () => {
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// 导航菜单项
const navItems = ref([
  { name: 'home', href: '/', current: true },
  { name: 'price', href: '/pricing', current: false },
  { name: 'blog', href: '/blog', current: false },
])

// 多语言相关状态
// const currentLanguage = ref('zh')
// const languages = ['zh', 'en', 'ja']
const languageDropdownOpen = ref(false)

const toggleLanguageDropdown = () => {
  languageDropdownOpen.value = !languageDropdownOpen.value
}

const closeLanguageDropdown = () => {
  languageDropdownOpen.value = false
}

const changeLanguage = async (lc) => {
  //currentLanguage.value = lang
  var code = lc.code
  locale.value = code
  const currentRouteName = route.name?.toString().split('___')[0]
  if (currentRouteName) {
    const newPath = localePath(currentRouteName)
    await router.push(newPath)
  } else {
    await router.push(`/${code}`)
  }
  closeLanguageDropdown()
}

// 获取可选语言
const languages = computed(() => locales.value)


// 移动端菜单状态
const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}



</script>

<style>
/* 点击页面任意位置关闭 */
#lang-toggle:not(:checked) ~ .dropdown-menu {
  display: none;
}

.dropdown-menu {
  transition: opacity 0.2s, transform 0.2s;
}
</style>