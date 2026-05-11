<script setup lang="ts">
import {
  ArrowDownTrayIcon,
  ArrowRightIcon,
  BoltIcon,
  CloudArrowDownIcon,
  CommandLineIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  LockClosedIcon,
  QuestionMarkCircleIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '~/stores/auth'
import type { DownloadType } from '~/composables/useDownloadLinks'

useHead({
  title: '黄鸟加速器 | 官方客户端下载',
  meta: [
    {
      name: 'description',
      content:
        '黄鸟加速器提供 Windows、macOS、Android、iOS 官方客户端下载，帮助用户快速安装、登录并开始使用。',
    },
  ],
  script: [
    {
      id: 'zoho-salesiq-inline',
      children: "window.$zoho=window.$zoho||{};$zoho.salesiq=$zoho.salesiq||{ready:function(){}};",
    },
    {
      id: 'zsiqscript',
      src: 'https://salesiq.zohopublic.com/widget?wc=siq9635103a44c2ba5d5c6fa9ccf2110737',
      defer: true,
    },
  ],
})

const localePath = useLocalePath()
const router = useRouter()
const authStore = useAuthStore()
const platformsAnchor = computed(() => `${localePath('index')}#platforms`)

const { downloadLinks, loadDownloadLinks, detectPreferredType, openDownload } = useDownloadLinks()
const preferredType = ref<DownloadType | ''>('')

await loadDownloadLinks()

onMounted(() => {
  preferredType.value = detectPreferredType()
})

const heroHighlights = [
  {
    title: '一键连接',
    description: '打开客户端后可快速连接，上手简单，适合日常使用。',
    icon: BoltIcon,
  },
  {
    title: '永久免费',
    description: '提供长期可用的免费体验，安装完成后即可开始使用。',
    icon: SparklesIcon,
  },
  {
    title: '全球节点',
    description: '覆盖多个地区节点，满足不同网络环境下的连接需求。',
    icon: GlobeAltIcon,
  },
  {
    title: '安全加密',
    description: '连接过程采用加密传输，兼顾稳定性与使用安全感。',
    icon: LockClosedIcon,
  },
]

const featureCards = [
  {
    title: '官方客户端下载',
    description: 'Windows、macOS、Android、iOS 官方版本集中展示，查找和下载安装更省心。',
    icon: CloudArrowDownIcon,
  },
  {
    title: '多平台支持',
    description: '支持桌面端与移动端多个系统版本，不同设备之间切换也更方便。',
    icon: ComputerDesktopIcon,
  },
  {
    title: '专有线路加速',
    description: '提供专有线路与中转加速能力，连接更稳定，访问更流畅。',
    icon: LockClosedIcon,
  },
  {
    title: '稳定高速连接',
    description: '适合日常浏览、影音娱乐、学习与办公等常见使用场景，连接体验更顺畅。',
    icon: RocketLaunchIcon,
  },
]

const faqs = ref([
  {
    question: '第一次使用应该从哪里开始？',
    answer: '建议先下载当前设备对应版本，安装完成后再登录账号并开始使用。首页主按钮和客户端下载区域都可以直达对应版本。',
    open: true,
  },
  {
    question: '支持哪些设备平台？',
    answer: '当前提供 Windows、macOS、Android 和 iOS 官方客户端下载，桌面端与移动端都可以快速找到对应版本。',
    open: false,
  },
  {
    question: '如果没有识别到当前设备怎么办？',
    answer: '你可以直接在首页客户端下载区域手动选择平台版本，页面会统一列出全部客户端入口。',
    open: false,
  },
  {
    question: '下载完成后怎么进入后台？',
    answer: '页面顶部和底部都保留了后台入口，下载客户端后也可以继续从这里登录进入账号后台。',
    open: false,
  },
])

const platformCards = computed(() => [
  {
    key: 'windows' as DownloadType,
    name: 'Windows',
    description: '适合主力办公设备与长时间连接场景。',
    detail: '桌面端官方版本',
    buttonText: '下载 EXE',
    href: downloadLinks.value.windows,
    icon: ComputerDesktopIcon,
    iconClass: 'from-sky-500/20 to-blue-500/5 text-sky-600 dark:text-sky-300',
  },
  {
    key: 'macos' as DownloadType,
    name: 'macOS',
    description: '兼顾桌面效率与轻量体验，适合 Mac 设备。',
    detail: '适配 macOS 设备',
    buttonText: '下载 DMG',
    href: downloadLinks.value.macos,
    icon: CommandLineIcon,
    iconClass: 'from-slate-500/20 to-slate-300/5 text-slate-700 dark:text-slate-200',
  },
  {
    key: 'android' as DownloadType,
    name: 'Android',
    description: '适合安卓手机和平板，下载安装更直接。',
    detail: '移动端快速安装',
    buttonText: '下载 APK',
    href: downloadLinks.value.android,
    icon: DevicePhoneMobileIcon,
    iconClass: 'from-emerald-500/20 to-green-500/5 text-emerald-600 dark:text-emerald-300',
  },
  {
    key: 'ios' as DownloadType,
    name: 'iOS',
    description: '适合 iPhone 和 iPad，下载指引更清晰。',
    detail: 'iPhone / iPad',
    buttonText: '前往下载',
    href: downloadLinks.value.ios,
    icon: SparklesIcon,
    iconClass: 'from-amber-500/20 to-orange-500/5 text-amber-600 dark:text-amber-300',
  },
])

const activeDownloadPlatform = computed(() => {
  return (
    platformCards.value.find((item) => item.key === preferredType.value) ??
    platformCards.value.find((item) => item.href) ??
    null
  )
})

const primaryDownloadText = computed(() => {
  return activeDownloadPlatform.value
    ? `下载 ${activeDownloadPlatform.value.name} 客户端`
    : '查看客户端下载'
})

const primaryDownloadHint = computed(() => {
  if (!preferredType.value) {
    return '支持 Windows / macOS / Android / iOS 官方客户端下载'
  }

  const match = platformCards.value.find((item) => item.key === preferredType.value)
  return match
    ? `当前设备推荐：${match.name} 客户端`
    : '支持 Windows / macOS / Android / iOS 官方客户端下载'
})

const toggleFaq = (index: number) => {
  faqs.value = faqs.value.map((item, currentIndex) => ({
    ...item,
    open: currentIndex === index ? !item.open : item.open,
  }))
}

const downloadPreferred = () => {
  const target = openDownload(preferredType.value || activeDownloadPlatform.value?.key)

  if (target) {
    return
  }

  if (!preferredType.value) {
    router.push(platformsAnchor.value)
  }
}

const goToPlatforms = async () => {
  await router.push(platformsAnchor.value).catch(() => undefined)

  if (process.client) {
    requestAnimationFrame(() => {
      document.getElementById('platforms')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }
}

const goDashboard = () => {
  if (authStore.isLoggedIn) {
    router.push('/profile/person')
    return
  }

  router.push(localePath('login'))
}
</script>

<template>
  <div class="overflow-hidden">
    <section class="site-shell site-section pt-8 sm:pt-12 lg:pt-14">
      <div class="grid items-center gap-8 lg:grid-cols-[1fr_.94fr] lg:gap-12">
        <div class="space-y-6">
          <div class="space-y-4">
            <span class="section-eyebrow">黄鸟加速器官方客户端</span>
            <h1 class="hero-title max-w-3xl">
              稳定连接，下载即用            </h1>
            <p class="section-lead max-w-2xl">
              提供 Windows、macOS、Android、iOS 官方客户端下载，帮助你更快完成安装、登录并开始使用。桌面端和移动端版本都能在这里快速找到。            </p>
          </div>

          <div class="flex flex-wrap items-center gap-4">
            <button type="button" class="brand-button" @click="downloadPreferred">
              <ArrowDownTrayIcon class="h-5 w-5" />
              {{ primaryDownloadText }}
            </button>

            <button type="button" class="brand-button-secondary" @click="goToPlatforms">
              查看全部版本
              <ArrowRightIcon class="h-5 w-5" />
            </button>
          </div>

          <div class="rounded-[24px] border border-[color:var(--site-line)] bg-white/85 px-4 py-4 text-sm text-[color:var(--site-muted)] shadow-[0_10px_30px_rgba(15,23,42,0.05)] dark:bg-white/5 dark:shadow-none">
            <span class="font-semibold text-[color:var(--site-text)]">{{ primaryDownloadHint }}</span>
            <span class="mx-2 hidden sm:inline">·</span>
            <span>支持 Windows / macOS / Android / iOS 官方客户端</span>
          </div>
        </div>

        <div class="relative">
          <div class="absolute left-4 top-6 h-32 w-32 rounded-full bg-amber-300/28 blur-3xl dark:bg-amber-300/12" />
          <div class="absolute bottom-6 right-0 h-36 w-36 rounded-full bg-sky-400/18 blur-3xl dark:bg-sky-400/10" />

          <div class="glass-panel relative overflow-hidden rounded-[32px] p-5 sm:p-6">
            <div class="grid gap-5 lg:grid-cols-[248px_1fr] lg:items-center">
              <div class="relative mx-auto flex w-full justify-center">
                <div class="hero-device-wrap">
                  <span class="hero-device-side hero-device-side-left hero-device-side-left-top" />
                  <span class="hero-device-side hero-device-side-left hero-device-side-left-bottom" />
                  <span class="hero-device-side hero-device-side-right" />

                  <div class="hero-device">
                    <div class="hero-device-topbar">
                      <span class="hero-device-speaker" />
                      <span class="hero-device-camera" />
                    </div>

                    <div class="hero-device-screen">
                      <img
                        src="/images/index/phone.png"
                        alt="黄鸟加速器移动端界面预览"
                        class="hero-device-image"
                      />
                    </div>
                  </div>

                  <div class="hero-device-reflection" />
                  <div class="hero-device-shadow" />
                </div>
              </div>

              <div class="space-y-4">
                <div>
                  <p class="text-sm font-medium text-[color:var(--site-muted)]">产品特点</p>
                  <h2 class="mt-1 text-2xl font-semibold text-[color:var(--site-text)]">
                    简单好用，稳定连接
                  </h2>
                </div>

                <div class="grid gap-3">
                  <article
                    v-for="item in heroHighlights"
                    :key="item.title"
                    class="surface-card rounded-[22px] p-4"
                  >
                    <div class="flex items-start gap-3">
                      <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400/20 to-sky-400/10 text-amber-600 dark:text-amber-300">
                        <component :is="item.icon" class="h-5 w-5" />
                      </div>
                      <div>
                        <h3 class="text-base font-semibold text-[color:var(--site-text)]">{{ item.title }}</h3>
                        <p class="mt-1 text-sm leading-6 text-[color:var(--site-muted)]">{{ item.description }}</p>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="features" class="site-shell site-section pt-0">
      <div class="max-w-3xl space-y-4">
        <span class="section-eyebrow">核心优势</span>
        <h2 class="section-title">官方客户端，多端支持，使用更省心</h2>
        <p class="section-lead">
          围绕下载、安装、登录和日常使用，把用户最常用的功能与入口集中展示，减少查找成本。        </p>
      </div>

      <div class="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <article
          v-for="item in featureCards"
          :key="item.title"
          class="surface-card rounded-[26px] p-6"
        >
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400/20 to-sky-400/10 text-amber-600 dark:text-amber-300">
            <component :is="item.icon" class="h-6 w-6" />
          </div>
          <h3 class="mt-5 text-lg font-semibold text-[color:var(--site-text)]">{{ item.title }}</h3>
          <p class="mt-2 text-sm leading-7 text-[color:var(--site-muted)]">{{ item.description }}</p>
        </article>
      </div>
    </section>

    <section id="platforms" class="site-shell site-section pt-0">
      <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div class="max-w-3xl space-y-4">
          <span class="section-eyebrow">客户端下载</span>
          <h2 class="section-title">选择适合你设备的客户端版本</h2>
          <p class="section-lead">
            Windows、macOS、Android、iOS 官方版本统一展示，进入页面后即可快速找到对应下载入口。          </p>
        </div>

        <button type="button" class="brand-button-secondary" @click="goToPlatforms">
          进入下载中心
          <ArrowRightIcon class="h-5 w-5" />
        </button>
      </div>

      <div class="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <article
          v-for="item in platformCards"
          :key="item.key"
          class="surface-card flex h-full flex-col rounded-[28px] p-6"
          :class="item.key === preferredType ? 'ring-2 ring-amber-400/60' : ''"
        >
          <div class="flex items-start justify-between gap-3">
            <div
              class="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br"
              :class="item.iconClass"
            >
              <component :is="item.icon" class="h-7 w-7" />
            </div>
            <span
              class="inline-flex min-h-[28px] min-w-[76px] items-center justify-center rounded-full px-3 py-1 text-xs font-semibold"
              :class="item.key === preferredType ? 'bg-amber-400/15 text-amber-600 dark:text-amber-300' : 'opacity-0'"
            >
              当前推荐
            </span>
          </div>

          <div class="mt-5 flex min-h-[132px] flex-col">
            <p class="text-sm font-medium leading-6 text-[color:var(--site-muted)]">{{ item.detail }}</p>
            <h3 class="mt-1 text-2xl font-semibold text-[color:var(--site-text)]">{{ item.name }}</h3>
            <p class="mt-3 text-sm leading-7 text-[color:var(--site-muted)]">{{ item.description }}</p>
          </div>

          <div class="mt-auto pt-6">
            <a
              v-if="item.href"
              :href="item.href"
              target="_blank"
              rel="noopener noreferrer"
              class="brand-button w-full justify-center"
              @click.prevent="openDownload(item.key)"
            >
              {{ item.buttonText }}
            </a>
            <button
              v-else
              type="button"
              class="brand-button-secondary flex w-full justify-center"
              @click="openDownload(item.key)"
            >
              {{ item.buttonText }}
            </button>
          </div>
        </article>
      </div>
    </section>

    <section id="faq" class="site-shell site-section pt-0">
      <div class="max-w-3xl space-y-4">
        <span class="section-eyebrow">常见问题</span>
        <h2 class="section-title">先把最常见的问题说明白</h2>
        <p class="section-lead">
          把下载平台、设备识别、后台入口等常见问题集中到一处，避免首页重复解释同一件事。        </p>
      </div>

      <div class="mt-10 space-y-4">
        <article
          v-for="(item, index) in faqs"
          :key="item.question"
          class="surface-card rounded-[24px] px-5 py-4 sm:px-6"
        >
          <button
            type="button"
            class="flex w-full items-center justify-between gap-4 text-left"
            @click="toggleFaq(index)"
          >
            <div class="flex items-center gap-3">
              <QuestionMarkCircleIcon class="h-6 w-6 text-amber-500 dark:text-amber-300" />
              <span class="text-base font-semibold text-[color:var(--site-text)] sm:text-lg">
                {{ item.question }}
              </span>
            </div>
            <span
              class="flex h-10 w-10 items-center justify-center rounded-2xl border border-[color:var(--site-line)] text-xl font-semibold text-[color:var(--site-text)] transition"
              :class="item.open ? 'rotate-45' : ''"
            >
              +
            </span>
          </button>

          <div v-if="item.open" class="mt-4 pl-9 text-sm leading-7 text-[color:var(--site-muted)] sm:text-base">
            {{ item.answer }}
          </div>
        </article>
      </div>
    </section>

    <section class="site-shell site-section pt-0">
      <div class="glass-panel rounded-[30px] px-6 py-8 sm:px-8">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div class="max-w-2xl">
            <span class="section-eyebrow">账号服务</span>
            <h2 class="mt-4 text-2xl font-semibold text-[color:var(--site-text)] sm:text-3xl">
              已有账号？可直接进入后台继续使用
            </h2>
            <p class="mt-3 text-sm leading-7 text-[color:var(--site-muted)] sm:text-base">
              账号登录、设备管理和后续功能都可以在后台继续完成；如果有使用问题，也可以先查看常见问题说明。            </p>
          </div>

          <div class="flex flex-wrap gap-4">
            <button type="button" class="brand-button-secondary" @click="goDashboard">
              进入后台
              <ArrowRightIcon class="h-5 w-5" />
            </button>

            <NuxtLink :to="`${localePath('index')}#faq`" class="brand-button-secondary">
              常见问题
              <ArrowRightIcon class="h-5 w-5" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <BackToTopBtn />
  </div>
</template>
