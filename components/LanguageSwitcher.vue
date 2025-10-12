<template>
  <div class="relative inline-block text-left">
    <label for="lang-select" class="sr-only">语言切换</label>
    <select
      id="lang-select"
      v-model="selectedLocale"
      @change="switchLanguage(selectedLocale)"
      class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      <option
        v-for="locale in availableLocales"
        :key="locale.code"
        :value="locale.code"
      >
        {{ locale.name }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import { useLocalePath } from '#imports'
import { computed, ref, watch } from 'vue'

const { locale, locales } = useI18n()
const router = useRouter()
const route = useRoute()
const localePath = useLocalePath()

const selectedLocale = ref(locale.value)

// 同步 locale 状态
watch(locale, (newLocale) => {
  selectedLocale.value = newLocale
})

// 切换语言逻辑
const switchLanguage = async (code) => {
  locale.value = code
  const currentRouteName = route.name?.toString().split('___')[0]
  if (currentRouteName) {
    const newPath = localePath(currentRouteName)
    await router.push(newPath)
  } else {
    await router.push(`/${code}`)
  }
}

// 获取可选语言
const availableLocales = computed(() => locales.value)
</script>
