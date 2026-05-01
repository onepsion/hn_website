<script setup lang="ts">
const localePath = useLocalePath()
const year = new Date().getFullYear()

const quickLinks = computed(() => [
  { label: '首页', to: localePath('index') },
  { label: '核心优势', to: `${localePath('index')}#features` },
  { label: '常见问题', to: `${localePath('index')}#faq` },
  { label: '进入后台', to: localePath('login') },
])

const productHighlights = [
  '一键连接，打开客户端后即可快速使用',
  '永久免费，安装完成后即可开始体验',
  '全球节点，覆盖多个地区连接场景',
  '安全加密，连接过程更安心',
]
</script>

<template>
  <footer class="px-4 pb-10 pt-6 sm:px-6 lg:px-8">
    <div class="site-shell">
      <div class="glass-panel rounded-[32px] p-8 sm:p-10">
        <div class="grid gap-10 lg:grid-cols-[1.2fr_.8fr_.9fr]">
          <div class="space-y-5">
            <div class="flex items-center gap-3">
              <span
                class="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/60 bg-white/80 shadow-[0_12px_30px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-slate-900/70"
              >
                <img src="@/assets/logo/logo.png" alt="黄鸟加速器 Logo" class="h-8 w-auto" />
              </span>
              <div>
                <p class="text-xs font-semibold tracking-[0.08em] text-amber-600 dark:text-amber-300">
                  官方客户端
                </p>
                <h2 class="text-xl font-semibold text-[color:var(--site-text)]">黄鸟加速器</h2>
              </div>
            </div>

            <p class="max-w-xl text-sm leading-7 text-[color:var(--site-muted)] sm:text-base">
              提供 Windows、macOS、Android、iOS 官方客户端下载，并保留账号后台与常见问题入口，帮助用户更顺利地开始使用。
            </p>

            <div class="flex flex-wrap gap-3">
              <NuxtLink :to="`${localePath('index')}#faq`" class="brand-button-secondary">常见问题</NuxtLink>
              <NuxtLink :to="localePath('login')" class="brand-button">进入后台</NuxtLink>
            </div>
          </div>

          <div>
            <p class="text-sm font-semibold tracking-[0.08em] text-[color:var(--site-muted)]">快速导航</p>
            <div class="mt-5 space-y-3">
              <NuxtLink
                v-for="item in quickLinks"
                :key="item.label"
                :to="item.to"
                class="block text-sm font-medium text-[color:var(--site-text)] transition hover:text-amber-600 dark:hover:text-amber-300"
              >
                {{ item.label }}
              </NuxtLink>
            </div>
          </div>

          <div>
            <p class="text-sm font-semibold tracking-[0.08em] text-[color:var(--site-muted)]">产品特点</p>
            <div class="mt-5 space-y-3">
              <p
                v-for="item in productHighlights"
                :key="item"
                class="rounded-2xl border border-[color:var(--site-line)] bg-white/70 px-4 py-3 text-sm leading-6 text-[color:var(--site-muted)] dark:bg-white/5"
              >
                {{ item }}
              </p>
            </div>
          </div>
        </div>

        <div class="site-divider mt-8" />

        <div class="mt-6 flex flex-col gap-3 text-sm text-[color:var(--site-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {{ year }} 黄鸟加速器. All rights reserved.</p>
          <p>官方客户端、账号后台与产品特点已集中展示。</p>
        </div>
      </div>
    </div>
  </footer>
</template>
