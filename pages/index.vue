<script setup lang="ts">
useHead({
  title: '黄鸟加速器 | 欢迎使用黄鸟加速器',
  meta: [
    { name: 'description', content: '黄鸟加速 - 突破网络限制，提供高速专线服务，畅享专业、安全、极速的网络体验，支持Windows, Macos, Android, IOS系统，永久免费使用。' }
  ],
})

import { reactive } from 'vue'
import { useRuntimeConfig } from '#app'
const downloadLinks = ref<{
  [key: string]: string;
}>({
  windows: '',
  macos: '',
  android: '',
  ios: ''
});

const faqs = reactive([
  {
    question: '你们的退款政策是什么？',
    answer: '我们提供30天无理由退款保证，无需说明原因。',
    open: false,
  },
  {
    question: '是否提供团队折扣？',
    answer: '是的！如需团队定制定价，请根据您的需求联系我们。',
    open: false,
  },
  {
    question: '如何联系客服支持？',
    answer: '您可以通过电子邮件或我们网站上的在线客服与支持团队取得联系。',
    open: false,
  },
])

function toggle(index: number) {
  faqs[index].open = !faqs[index].open
}

const downloadText = ref('立即下载')
const downloadType = ref('')

const config = useRuntimeConfig()
const res = await useFetch(`${config.public.apiBase}/app/settings/query`) as any

if (res.code === 200) {
    var data = res.rows;
    for (var index in data) {
        if (data[index].appType == 'windows') {
            downloadLinks.value.windows = data[index].downUrl
        } else if (data[index].appType == 'android') {
            downloadLinks.value.android = data[index].downUrl
        } else if (data[index].appType == 'darwin') {
            downloadLinks.value.macos = data[index].downUrl
        } else if (data[index].appType == 'ios') {
            downloadLinks.value.ios = data[index].downUrl
        }
    }
} 

// const res = await querySettings()



onMounted(() => {
  const ua = navigator.userAgent
  
  if (/Android/i.test(ua)) {
    downloadText.value = 'Android 客户端下载'
    downloadType.value = 'android'
  } else if (/iPhone|iPad|iPod/i.test(ua)) {
    downloadText.value = 'iOS 客户端下载'
    downloadType.value = 'ios'
  } else if (/Macintosh/i.test(ua)) {
    downloadText.value = 'MacOS 客户端下载'
    downloadType.value = 'darwin'
  } else if (/Windows/i.test(ua)) {
    downloadText.value = 'Windows 客户端下载'
    downloadType.value = 'windows'
  } else {
      downloadText.value = '立即下载'
      downloadType.value = ""
    }
})

const downApp = () => {
  var downObj = downloadLinks.value;
  window.location.href = downObj[downloadType.value]
}
</script>

<template>
  <div>
    <div class="bg-gray-100 dark:bg-[url('/images/index/bg1.png')] bg-cover bg-center bg-no-repeat">
      <div class="relative isolate px-6 pt-0 lg:px-8 max-w-7xl mx-auto w-auto">
    
      <div class="grid grid-cols-1 justify-items-center items-center lg:grid-cols-2 gap-4 lg:gap-6 items-center py-16 sm:py-24 lg:py-32">
          <!-- 左侧内容：保持不变，仅间距受grid控制 -->
          <div class="mx-auto max-w-2xl lg:mx-0 lg:max-w-lg">
            <div class="hidden sm:mb-8 sm:flex sm:justify-center lg:justify-start">
              <div class="relative rounded-full px-3 py-1 text-sm/6 text-gray-900 dark:text-white ring-gray-900/10 hover:ring-gray-900/20">
                突破网络限制，畅享极速体验
              </div>
            </div>
            <div class="text-center lg:text-left">
              <h1 class="text-5xl font-semibold tracking-tight text-balance text-gray-900 dark:text-white sm:text-5xl">黄鸟加速 快人一步</h1>
              <p class="mt-8 text-lg font-medium text-pretty text-gray-900 dark:text-white sm:text-xl/8">高速专线，畅享加速，专业安全高速的极致体验.</p>
              <p class="text-[#ffce00] text-lg font-medium mt-4">永久免费使用</p>

              <div class="mt-10 flex items-center justify-center lg:justify-start gap-x-6">
                <!-- <div class="w-10 h-10 transition-transform duration-300 hover:scale-110 bg-gray-400 rounded cursor-pointer">
                  <img src="/images/svg/windows.svg" alt="Windows 图标" class="w-full h-full p-1" />
                </div>
                <div class="w-10 h-10 transition-transform duration-300 hover:scale-110 bg-gray-400 rounded cursor-pointer">
                  <img src="/images/svg/andriod.svg" alt="Android 图标" class="w-full h-full p-1" />
                </div>
                <div class="w-10 h-10 transition-transform duration-300 hover:scale-110 bg-gray-400 rounded cursor-pointer">
                  <img src="/images/svg/macos.svg" alt="Macos 图标" class="w-full h-full p-1" />
                </div> -->
                <!-- <div class="w-10 h-10 transition-transform duration-300 hover:scale-110 bg-yellow-600 rounded cursor-pointer">
                  <img src="/images/svg/macos.svg" alt="IOS 图标" class="w-full h-full p-1" />
                </div> -->
                <a href="javascript:void(0)" @click="downApp" class="rounded-md bg-yellow-500 px-3.5 py-2.5 text-sm font-semibold text-gray-900 dark:text-white shadow-xs hover:text-white hover:bg-yellow-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors duration-300">
                  {{ downloadText }}
                </a>
              </div>
            </div>
          </div>
          
          <!-- 右侧手机壳：增加左移微调，进一步缩小与左侧的距离 -->
          <div class="relative flex justify-center lg:justify-end 
            lg:-ml-4  <!-- 关键：大屏幕下向左偏移4px，进一步拉近（可按需调整为-ml-2/-ml-6） -->
          ">
            <div class="relative">
              <!-- 手机壳主体（保持原样式不变） -->
              <div class="w-[280px] h-[500px] rounded-[40px] border-8 border-gray-800 bg-gradient-to-br from-gray-700 to-gray-900 shadow-[0_10px_30px_rgba(0,0,0,0.3),inset_0_0_15px_rgba(0,0,0,0.5)] relative overflow-hidden">
                <!-- 屏幕区域 -->
                <div class="absolute inset-[10px_10px] bg-black rounded-[30px] overflow-hidden">
                  <img src="/images/index/phone.png" alt="手机屏幕内容" class="w-full h-full object-cover"/>
                  <!-- <img src="/images/index/phone.png" alt="手机屏幕内容" class="w-full h-full object-cover" loading="lazy"> -->
                </div>
                <!-- 手机壳纹理 -->
                <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
              </div>
            </div>
          </div>
        </div>
    
    
  </div>
</div>
    

    <div class= "relative dark:bg-gray-900  isolate overflow-hidden">

      <!-- <div class="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl" aria-hidden="true">
          <div class="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#d4ee55] to-[#776fff] opacity-20"
            style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)">
          </div>
        </div>

        <div class="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu" aria-hidden="true">
          <div class="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#d4ee55] to-[#776fff] opacity-20"
            style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)">
          </div>
        </div> -->

      <div class="relative isolate overflow-hidden py-16 sm:py-18 max-w-7xl mx-auto w-auto">
          <!-- <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=focalpoint&fp-y=.8&w=2830&h=1500&q=80&blend=111827&sat=-100&exp=15&blend-mode=multiply" alt="" class="absolute inset-0 -z-10 size-full object-cover object-right md:object-center" /> -->
          <!-- <div class="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl" aria-hidden="true">
            <div class="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
          </div>
          <div class="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu" aria-hidden="true">
            <div class="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
          </div> -->
          <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <div class="mx-auto max-w-2xl lg:mx-0">
              <h2 class="text-3xl font-semibold tracking-tight text-gray-500 dark:text-white sm:text-4xl">优质服务</h2>
            </div>
            <div class="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
              <!-- <div class="grid grid-cols-1 gap-x-8 gap-y-6 text-base/7 font-semibold text-gray-900 dark:text-white sm:grid-cols-2 md:flex lg:gap-x-10">
                <a href="#">Open roles <span aria-hidden="true">&rarr;</span></a>
                <a href="#">Internship program <span aria-hidden="true">&rarr;</span></a>
                <a href="#">Our values <span aria-hidden="true">&rarr;</span></a>
                <a href="#">Meet our leadership <span aria-hidden="true">&rarr;</span></a>
              </div> -->
              <dl class="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
                <div class="flex flex-col-reverse gap-1">
                  <dt class="text-base/7 text-gray-500 dark:text-white">服务器数</dt>
                  <dd class="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">400+</dd>
                </div>
                <div class="flex flex-col-reverse gap-1">
                  <dt class="text-base/7 text-gray-500 dark:text-white">专业团队</dt>
                  <dd class="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">40人</dd>
                </div>
                <div class="flex flex-col-reverse gap-1">
                  <dt class="text-base/7 text-gray-500 dark:text-white">每周工作时长</dt>
                  <dd class="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">56小时</dd>
                </div>
                <div class="flex flex-col-reverse gap-1">
                  <dt class="text-base/7 text-gray-500 dark:text-white">客服服务时间</dt>
                  <dd class="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">无限制</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>


    </div>

    <div class="bg-gray-100/50 dark:bg-gray-900/95">
      <div class="py-24 sm:py-32 max-w-7xl mx-auto w-auto">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div class="mx-auto max-w-2xl lg:text-center">
            <p class="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-balance">覆盖全球高速网络节点</p>
          
            <a href="" class="block pt-10">
                  <img
                    src="/images/svg/world-map.svg"
                    alt="image"
                    class="w-full transition group-hover:rotate-6 group-hover:scale-125"
                  />
                </a>
          </div>
          <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              <div class="relative pl-16">
                <dt class="text-base/7 font-semibold text-gray-900 dark:text-white">
                  <div class="absolute left-0 top-0 flex size-10 items-center justify-center rounded-lg">
                    <span class="text-4xl">🌍</span>
                  </div>
                  全球精选专线
                </dt>
                <dd class="mt-2 text-base/7 text-gray-700 dark:text-gray-500">提供全球几十条高速网络节点，总有最匹配你的节点，给你极致体验风格。</dd>
              </div>
              <div class="relative pl-16">
                <dt class="text-base/7 font-semibold text-gray-900 dark:text-white">
                  <div class="absolute left-0 top-0 flex size-10 items-center justify-center rounded-lg">
                    <span class="text-4xl">🔒</span>
                  </div>
                  免费使用无限流量
                </dt>
                <dd class="mt-2 text-base/7 text-gray-700 dark:text-gray-500">不管是VIP还是免费用户，黄鸟不做任何流量限制，永久免费，无需因为用量而担心</dd>
              </div>
              <div class="relative pl-16">
                <dt class="text-base/7 font-semibold text-gray-900 dark:text-white">
                  <div class="absolute left-0 top-0 flex size-10 items-center justify-center rounded-lg">
                    <span class="text-4xl">⚡</span>
                  </div>
                  高清播放
                </dt>
                <dd class="mt-2 text-base/7 text-gray-700 dark:text-gray-500">使用独创边缘节点加速技术，能够做到服务器智能分流，专业稳定，看视频高清不卡顿</dd>
              </div>
              <div class="relative pl-16">
                <dt class="text-base/7 font-semibold text-gray-900 dark:text-white">
                  <div class="absolute left-0 top-0 flex size-10 items-center justify-center rounded-lg">
                    <span class="text-4xl">📱</span>
                  </div>
                  全平台支持
                </dt>
                <dd class="mt-2 text-base/7 text-gray-700 dark:text-gray-500">支持iOS、Android、macOS、Windows多平台安装使用，最多支持个人3台设备同时运行</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  

    <!-- <div class="bg-gray-100/50 dark:bg-gray-900/95">
        <div class="bg-white dark:bg-gray-800/90 rounded-md py-24 sm:py-32 max-w-7xl mx-auto w-auto" >
          <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <div class="mx-auto max-w-2xl lg:mx-0">
              <h2 class="text-pretty text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl">From the blog</h2>
              <p class="mt-2 text-lg/8 text-gray-900 dark:text-white">Learn how to grow your business with our expert advice.</p>
            </div>
            <div class="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t dark:border-gray-700 border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              <article class="flex max-w-xl flex-col items-start justify-between">
                <div class="flex items-center gap-x-4 text-xs">
                  <time datetime="2020-03-16" class="text-gray-900 dark:text-white">Mar 16, 2020</time>
                  <a href="#" class="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-900 dark:text-gray-900 hover:bg-gray-100">Marketing</a>
                </div>
                <div class="group relative">
                  <h3 class="mt-3 text-lg/6 font-semibold text-gray-600 dark:text-white group-hover:text-gray-400">
                    <a href="#">
                      <span class="absolute inset-0"></span>
                      Boost your conversion rate
                    </a>
                  </h3>
                  <p class="mt-5 line-clamp-3 text-sm/6 text-gray-900 dark:text-white">Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.</p>
                </div>
                <div class="relative mt-8 flex items-center gap-x-4">
                  <img src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" class="size-10 rounded-full bg-gray-50" />
                  <div class="text-sm/6">
                    <p class="font-semibold text-gray-900 dark:text-white">
                      <a href="#">
                        <span class="absolute inset-0"></span>
                        Michael Foster
                      </a>
                    </p>
                    <p class="text-gray-600">Co-Founder / CTO</p>
                  </div>
                </div>
              </article>

              <article class="flex max-w-xl flex-col items-start justify-between">
                <div class="flex items-center gap-x-4 text-xs">
                  <time datetime="2020-03-16" class="text-gray-900 dark:text-white">Mar 16, 2020</time>
                  <a href="#" class="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-900 dark:text-gray-900 hover:bg-gray-100">Marketing</a>
                </div>
                <div class="group relative">
                  <h3 class="mt-3 text-lg/6 font-semibold text-gray-600 dark:text-white group-hover:text-gray-400">
                    <a href="#">
                      <span class="absolute inset-0"></span>
                      Boost your conversion rate
                    </a>
                  </h3>
                  <p class="mt-5 line-clamp-3 text-sm/6 text-gray-900 dark:text-white">Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.</p>
                </div>
                <div class="relative mt-8 flex items-center gap-x-4">
                  <img src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" class="size-10 rounded-full bg-gray-50" />
                  <div class="text-sm/6">
                    <p class="font-semibold text-gray-900 dark:text-white">
                      <a href="#">
                        <span class="absolute inset-0"></span>
                        Michael Foster
                      </a>
                    </p>
                    <p class="text-gray-600">Co-Founder / CTO</p>
                  </div>
                </div>
              </article>

              <article class="flex max-w-xl flex-col items-start justify-between">
                <div class="flex items-center gap-x-4 text-xs">
                  <time datetime="2020-03-16" class="text-gray-900 dark:text-white">Mar 16, 2020</time>
                  <a href="#" class="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-900 dark:text-gray-900 hover:bg-gray-100">Marketing</a>
                </div>
                <div class="group relative">
                  <h3 class="mt-3 text-lg/6 font-semibold text-gray-600 dark:text-white group-hover:text-gray-400">
                    <a href="#">
                      <span class="absolute inset-0"></span>
                      Boost your conversion rate
                    </a>
                  </h3>
                  <p class="mt-5 line-clamp-3 text-sm/6 text-gray-900 dark:text-white">Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.</p>
                </div>
                <div class="relative mt-8 flex items-center gap-x-4">
                  <img src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" class="size-10 rounded-full bg-gray-50" />
                  <div class="text-sm/6">
                    <p class="font-semibold text-gray-900 dark:text-white">
                      <a href="#">
                        <span class="absolute inset-0"></span>
                        Michael Foster
                      </a>
                    </p>
                    <p class="text-gray-600">Co-Founder / CTO</p>
                  </div>
                </div>
              </article>
              
            </div>
          </div>
        </div>


    </div> -->

  

    <!-- ====== About Section Start -->
    <!-- <div class="bg-gray-100/50 dark:bg-gray-900/90">

      <section
        class="p-5 md:p-20 bg-gray-1 pb-8 pt-20 dark:bg-dark-2 lg:pb-[70px] lg:pt-[120px] max-w-7xl mx-auto w-auto"
        >
        <div class="container">
          <div class="wow fadeInUp" data-wow-delay=".2s">
            <div class="-mx-4 flex flex-wrap items-center">
              <div class="w-full px-4 lg:w-1/2">
                <div
                      class="mb-4 sm:mb-8 sm:h-[400px] md:h-[540px] lg:h-[400px] xl:h-[500px]"
                    >
                      <img
                        src="/images/about/01.png"
                        alt="about image"
                        class="h-full w-full object-cover object-center"
                      />
                    </div>
              </div>

              <div class="w-full px-4 lg:w-1/2">

                <div class="mb-12 max-w-[540px] lg:mb-0">
                  <h2
                    class="mb-5 text-3xl font-bold leading-tight text-dark dark:text-white sm:text-[40px] sm:leading-[1.2]"
                  >
                    关于我们
                  </h2>
                  <p
                    class="mb-10 text-base leading-relaxed text-gray-900 dark:text-white"
                  >
                    我们提供最快、最简单的VPN服务。
                    <br />
                    <br />
                    市场上有许多不同版本的Lorem ipsum段落，但大多数都经过了某种形式的修改，有的加入了幽默元素，有的则使用了看起来不连贯的随机词语。
                  </p>

                  <a
                    href="javascript:void(0)"
                    class="inline-flex items-center justify-center rounded-md border border-primary bg-primary px-7 py-3 text-center text-base font-medium text-gray-900 dark:text-white hover:bg-blue-dark"
                  >
                    了解更多
                  </a>
                </div>

                
              </div>
            </div>
          </div>
        </div>
      </section>

    </div> -->
    <!-- ====== About Section End -->

    <!-- ====== Pricing Section Start -->
     <!-- <div class="bg-gray-100/50 dark:bg-gray-900/90">
      <section
        id="pricing"
        class="p-5 md:p-20 relative z-20 overflow-hidden  pb-12 pt-20 dark:bg-dark lg:pb-[90px] lg:pt-[120px] max-w-8xl mx-auto w-auto"
      >
        <div class="container mx-auto">
          <div class="-mx-4 flex flex-wrap">
            <div class="w-full px-4">
              <div class="mx-auto mb-[60px] max-w-[510px] text-center">
                <span class="mb-2 block text-lg font-semibold text-gray-900 dark:text-white">
                  产品价格
                </span>
                <h2
                  class="mb-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl md:text-[40px] md:leading-[1.2]"
                >
                  产品套餐计划
                </h2>
          
              </div>
            </div>
          </div>
          <div class="-mx-4 flex flex-wrap justify-center">
            <div class="w-full px-4 md:w-1/2 lg:w-1/4">
              <div
                class="relative z-10 mb-10 overflow-hidden rounded-xl bg-white dark:bg-gray-700 px-8 py-10 shadow-pricing dark:bg-dark-2 sm:p-12 lg:px-6 lg:py-10 xl:p-14"
              >
                <span
                  class="mb-5 block text-xl font-medium text-gray-900 dark:text-white"
                >
                  月卡
                </span>
                <h2
                  class="mb-11 text-4xl font-semibold text-gray-900 dark:text-white xl:text-[42px] xl:leading-[1.21]"
                >
                  <span class="text-xl font-medium">￥</span>
                  <span class="-ml-1 -tracking-[2px]">25.00</span>
                  <span
                    class="text-base font-normal text-body-color dark:text-dark-6"
                  >
                    
                  </span>
                </h2>
                <div class="mb-[50px]">
                  <h5 class="mb-5 text-lg font-medium text-gray-900 dark:text-white">
                    内容
                  </h5>
                  <div class="flex flex-col gap-[14px] text-gray-900 dark:text-white">
                    <p class="text-base text-body-color">
                      时长30天
                    </p>
                    <p class="text-base text-body-color">
                      无限速
                    </p>
                    <p class="text-base text-body-color">
                      使用终端限制3台
                    </p>
                    <p class="text-base text-body-color">
                      24小时服务
                    </p>
                  </div>
                </div>
                <a
                    href="javascript:void(0)"
                    class="inline-flex items-center justify-center rounded-md border border-primary bg-primary px-7 py-3 text-center text-base font-medium text-gray-900 dark:text-white hover:text-white hover:bg-yellow-500"
                  >
                    立即购买
                  </a>
              </div>
            </div>
            <div class="w-full px-4 md:w-1/2 lg:w-1/4">
              <div
                class="relative z-10 mb-10 overflow-hidden rounded-xl bg-white dark:bg-gray-700 px-8 py-10 shadow-pricing dark:bg-dark-2 sm:p-12 lg:px-6 lg:py-10 xl:p-14"
              >
                <span
                  class="mb-5 block text-xl font-medium text-gray-900 dark:text-white"
                >
                  季卡
                </span>
                <h2
                  class="mb-11 text-4xl font-semibold text-gray-900 dark:text-white xl:text-[42px] xl:leading-[1.21]"
                >
                  <span class="text-xl font-medium">￥</span>
                  <span class="-ml-1 -tracking-[2px]">70.00</span>
                  <span
                    class="text-base font-normal text-body-color dark:text-dark-6"
                  >
                    
                  </span>
                </h2>
                <div class="mb-[50px]">
                  <h5 class="mb-5 text-lg font-medium text-gray-900 dark:text-white">
                    内容
                  </h5>
                  <div class="flex flex-col gap-[14px] text-gray-900 dark:text-white">
                    <p class="text-base text-body-color">
                      时长90天
                    </p>
                    <p class="text-base text-body-color">
                      无限速
                    </p>
                    <p class="text-base text-body-color">
                      使用终端限制3台
                    </p>
                    <p class="text-base text-body-color">
                      24小时服务
                    </p>
                  </div>
                </div>
                <a
                    href="javascript:void(0)"
                    class="inline-flex items-center justify-center rounded-md border border-primary bg-primary px-7 py-3 text-center text-base font-medium text-gray-900 dark:text-white hover:bg-yellow-500"
                  >
                    立即购买
                  </a>
              </div>
            </div>
            <div class="w-full px-4 md:w-1/2 lg:w-1/4">
              <div
                class="relative z-10 mb-10 overflow-hidden rounded-xl bg-white dark:bg-gray-700 px-8 py-10 shadow-pricing dark:bg-dark-2 sm:p-12 lg:px-6 lg:py-10 xl:p-14"
              >
                <span
                  class="mb-5 block text-xl font-medium text-gray-900 dark:text-white"
                >
                  半年卡
                </span>
                <h2
                  class="mb-11 text-4xl font-semibold text-gray-900 dark:text-white xl:text-[42px] xl:leading-[1.21]"
                >
                  <span class="text-xl font-medium">￥</span>
                  <span class="-ml-1 -tracking-[2px]">126.00</span>
                  <span
                    class="text-base font-normal text-body-color dark:text-dark-6"
                  >
                    
                  </span>
                </h2>
                <div class="mb-[50px]">
                  <h5 class="mb-5 text-lg font-medium text-gray-900 dark:text-white">
                    内容
                  </h5>
                  <div class="flex flex-col gap-[14px] text-gray-900 dark:text-white">
                    <p class="text-base text-body-color">
                      时长180天
                    </p>
                    <p class="text-base text-body-color">
                      无限速
                    </p>
                    <p class="text-base text-body-color">
                      使用终端限制3台
                    </p>
                    <p class="text-base text-body-color">
                      24小时服务
                    </p>
                  </div>
                </div>
                <a
                    href="javascript:void(0)"
                    class="inline-flex items-center justify-center rounded-md border border-primary bg-primary px-7 py-3 text-center text-base font-medium text-gray-900 dark:text-white hover:bg-yellow-500"
                  >
                    立即购买
                  </a>
              </div>
            </div>
            <div class="w-full px-4 md:w-1/2 lg:w-1/4">
              <div
                class="relative z-10 mb-10 overflow-hidden rounded-xl bg-white dark:bg-gray-700 px-8 py-10 shadow-pricing dark:bg-dark-2 sm:p-12 lg:px-6 lg:py-10 xl:p-14"
              >
                <span
                  class="mb-5 block text-xl font-medium text-gray-900 dark:text-white"
                >
                  年卡
                </span>
                <h2
                  class="mb-11 text-4xl font-semibold text-gray-900 dark:text-white xl:text-[42px] xl:leading-[1.21]"
                >
                  <span class="text-xl font-medium">￥</span>
                  <span class="-ml-1 -tracking-[2px]">216.00</span>
                  <span
                    class="text-base font-normal text-body-color dark:text-dark-6"
                  >
                    
                  </span>
                </h2>
                <div class="mb-[50px]">
                  <h5 class="mb-5 text-lg font-medium text-gray-900 dark:text-white">
                    年卡
                  </h5>
                  <div class="flex flex-col gap-[14px] text-gray-900 dark:text-white">
                    <p class="text-base text-body-color">
                      时长365天
                    </p>
                    <p class="text-base text-body-color">
                      无限速
                    </p>
                    <p class="text-base text-body-color">
                      使用终端限制3台
                    </p>
                    <p class="text-base text-body-color">
                      24小时服务
                    </p>
                  </div>
                </div>
                <a
                    href="javascript:void(0)"
                    class="inline-flex items-center justify-center rounded-md border border-primary bg-primary px-7 py-3 text-center text-base font-medium text-gray-900 dark:text-white hover:bg-yellow-500"
                  >
                    立即购买
                  </a>
              </div>
            </div>

            
          </div>
        </div>
      </section>
    </div> -->
    <!-- ====== Pricing Section End -->


    <!-- ====== FAQ Section Start -->
    
    <!-- <div class="bg-gray-100/50 dark:bg-gray-900/90">

      <div class="mx-auto px-4 py-12 max-w-7xl w-auto">
        
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">FAQs</h2>

        
        <div class="divide-y divide-gray-300 dark:divide-gray-700 border-t border-b">
          <div
            v-for="(faq, index) in faqs"
            :key="index"
            class="py-4 cursor-pointer select-none"
            @click="toggle(index)"
          >
            <div class="flex justify-between items-center">
              <span class="text-lg font-medium text-gray-900 dark:text-white">{{ faq.question }}</span>
              <span
                class="text-2xl font-bold text-yellow-500 transition-transform duration-300"
                :class="{ 'rotate-45': faq.open }"
              >
                +
              </span>
            </div>
            <div v-show="faq.open" class="mt-3 text-gray-900 dark:text-white text-base leading-relaxed transition">
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>

    </div> -->
    
    <!-- <section
      class="p-5 md:p-20 relative z-20 overflow-hidden bg-gray-100/50 dark:bg-gray-800 pb-8 pt-20 dark:bg-dark lg:pb-[50px] lg:pt-[120px]"
    >
      <div class="container mx-auto">
        <div class="-mx-4 flex flex-wrap">
          <div class="w-full px-4">
            <div class="mx-auto mb-[60px] max-w-[520px] text-center">
              <span class="mb-2 block text-lg font-semibold text-gray-900 dark:text-white">
                FAQ
              </span>
              <h2
                class="mb-3 text-3xl font-bold leading-[1.2] text-gray-900 dark:text-white sm:text-4xl md:text-[40px]"
              >
                Any Questions? Look Here
              </h2>
              <p
                class="mx-auto max-w-[485px] text-base text-gray-900 dark:text-white"
              >
                There are many variations of passages of Lorem Ipsum available
                but the majority have suffered alteration in some form.
              </p>
            </div>
          </div>
        </div>
        <div class="-mx-4 flex flex-wrap">
          <div class="w-full px-4 lg:w-1/2">
            <div class="mb-12 flex lg:mb-[70px]">
              <div
                class="mr-4 flex h-[50px] w-full max-w-[50px] items-center justify-center rounded-xl bg-primary text-gray-900 dark:text-white sm:mr-6 sm:h-[60px] sm:max-w-[60px]"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 34 34"
                  class="fill-current"
                >
                  <path
                    d="M17.0008 0.690674C7.96953 0.690674 0.691406 7.9688 0.691406 17C0.691406 26.0313 7.96953 33.3625 17.0008 33.3625C26.032 33.3625 33.3633 26.0313 33.3633 17C33.3633 7.9688 26.032 0.690674 17.0008 0.690674ZM17.0008 31.5032C9.03203 31.5032 2.55078 24.9688 2.55078 17C2.55078 9.0313 9.03203 2.55005 17.0008 2.55005C24.9695 2.55005 31.5039 9.0313 31.5039 17C31.5039 24.9688 24.9695 31.5032 17.0008 31.5032Z"
                  />
                  <path
                    d="M17.9039 6.32194C16.3633 6.05631 14.8227 6.48131 13.707 7.43756C12.5383 8.39381 11.8477 9.82819 11.8477 11.3688C11.8477 11.9532 11.9539 12.5376 12.1664 13.0688C12.3258 13.5469 12.857 13.8126 13.3352 13.6532C13.8133 13.4938 14.0789 12.9626 13.9195 12.4844C13.8133 12.1126 13.707 11.7938 13.707 11.3688C13.707 10.4126 14.132 9.50944 14.8758 8.87194C15.6195 8.23444 16.5758 7.96881 17.5852 8.18131C18.9133 8.39381 19.9758 9.50944 20.1883 10.7844C20.4539 12.3251 19.657 13.8126 18.2227 14.3969C16.8945 14.9282 16.0445 16.2563 16.0445 17.7969V21.1969C16.0445 21.7282 16.4695 22.1532 17.0008 22.1532C17.532 22.1532 17.957 21.7282 17.957 21.1969V17.7969C17.957 17.0532 18.382 16.3626 18.9664 16.1501C21.1977 15.2469 22.4727 12.9094 22.0477 10.4657C21.6758 8.39381 19.9758 6.69381 17.9039 6.32194Z"
                  />
                  <path
                    d="M17.0531 24.8625H16.8937C16.3625 24.8625 15.9375 25.2875 15.9375 25.8188C15.9375 26.35 16.3625 26.7751 16.8937 26.7751H17.0531C17.5844 26.7751 18.0094 26.35 18.0094 25.8188C18.0094 25.2875 17.5844 24.8625 17.0531 24.8625Z"
                  />
                </svg>
              </div>
              <div class="w-full">
                <h3
                  class="mb-6 text-xl font-semibold text-dark dark:text-white sm:text-2xl lg:text-xl xl:text-2xl"
                >
                  Is TailGrids Well-documented?
                </h3>
                <p class="text-base text-gray-900 dark:text-white">
                  It takes 2-3 weeks to get your first blog post ready. That
                  includes the in-depth research & creation of your monthly
                  content ui/ux strategy that we do writing your first blog
                  post.
                </p>
              </div>
            </div>
            <div class="mb-12 flex lg:mb-[70px]">
              <div
                class="mr-4 flex h-[50px] w-full max-w-[50px] items-center justify-center rounded-xl bg-primary text-white sm:mr-6 sm:h-[60px] sm:max-w-[60px]"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 34 34"
                  class="fill-current"
                >
                  <path
                    d="M17.0008 0.690674C7.96953 0.690674 0.691406 7.9688 0.691406 17C0.691406 26.0313 7.96953 33.3625 17.0008 33.3625C26.032 33.3625 33.3633 26.0313 33.3633 17C33.3633 7.9688 26.032 0.690674 17.0008 0.690674ZM17.0008 31.5032C9.03203 31.5032 2.55078 24.9688 2.55078 17C2.55078 9.0313 9.03203 2.55005 17.0008 2.55005C24.9695 2.55005 31.5039 9.0313 31.5039 17C31.5039 24.9688 24.9695 31.5032 17.0008 31.5032Z"
                  />
                  <path
                    d="M17.9039 6.32194C16.3633 6.05631 14.8227 6.48131 13.707 7.43756C12.5383 8.39381 11.8477 9.82819 11.8477 11.3688C11.8477 11.9532 11.9539 12.5376 12.1664 13.0688C12.3258 13.5469 12.857 13.8126 13.3352 13.6532C13.8133 13.4938 14.0789 12.9626 13.9195 12.4844C13.8133 12.1126 13.707 11.7938 13.707 11.3688C13.707 10.4126 14.132 9.50944 14.8758 8.87194C15.6195 8.23444 16.5758 7.96881 17.5852 8.18131C18.9133 8.39381 19.9758 9.50944 20.1883 10.7844C20.4539 12.3251 19.657 13.8126 18.2227 14.3969C16.8945 14.9282 16.0445 16.2563 16.0445 17.7969V21.1969C16.0445 21.7282 16.4695 22.1532 17.0008 22.1532C17.532 22.1532 17.957 21.7282 17.957 21.1969V17.7969C17.957 17.0532 18.382 16.3626 18.9664 16.1501C21.1977 15.2469 22.4727 12.9094 22.0477 10.4657C21.6758 8.39381 19.9758 6.69381 17.9039 6.32194Z"
                  />
                  <path
                    d="M17.0531 24.8625H16.8937C16.3625 24.8625 15.9375 25.2875 15.9375 25.8188C15.9375 26.35 16.3625 26.7751 16.8937 26.7751H17.0531C17.5844 26.7751 18.0094 26.35 18.0094 25.8188C18.0094 25.2875 17.5844 24.8625 17.0531 24.8625Z"
                  />
                </svg>
              </div>
              <div class="w-full">
                <h3
                  class="mb-6 text-xl font-semibold text-dark dark:text-white sm:text-2xl lg:text-xl xl:text-2xl"
                >
                  Is TailGrids Well-documented?
                </h3>
                <p class="text-base text-gray-900 dark:text-white">
                  It takes 2-3 weeks to get your first blog post ready. That
                  includes the in-depth research & creation of your monthly
                  content ui/ux strategy that we do writing your first blog
                  post.
                </p>
              </div>
            </div>
          </div>
          <div class="w-full px-4 lg:w-1/2">
            <div class="mb-12 flex lg:mb-[70px]">
              <div
                class="mr-4 flex h-[50px] w-full max-w-[50px] items-center justify-center rounded-xl bg-primary text-white sm:mr-6 sm:h-[60px] sm:max-w-[60px]"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 34 34"
                  class="fill-current"
                >
                  <path
                    d="M17.0008 0.690674C7.96953 0.690674 0.691406 7.9688 0.691406 17C0.691406 26.0313 7.96953 33.3625 17.0008 33.3625C26.032 33.3625 33.3633 26.0313 33.3633 17C33.3633 7.9688 26.032 0.690674 17.0008 0.690674ZM17.0008 31.5032C9.03203 31.5032 2.55078 24.9688 2.55078 17C2.55078 9.0313 9.03203 2.55005 17.0008 2.55005C24.9695 2.55005 31.5039 9.0313 31.5039 17C31.5039 24.9688 24.9695 31.5032 17.0008 31.5032Z"
                  />
                  <path
                    d="M17.9039 6.32194C16.3633 6.05631 14.8227 6.48131 13.707 7.43756C12.5383 8.39381 11.8477 9.82819 11.8477 11.3688C11.8477 11.9532 11.9539 12.5376 12.1664 13.0688C12.3258 13.5469 12.857 13.8126 13.3352 13.6532C13.8133 13.4938 14.0789 12.9626 13.9195 12.4844C13.8133 12.1126 13.707 11.7938 13.707 11.3688C13.707 10.4126 14.132 9.50944 14.8758 8.87194C15.6195 8.23444 16.5758 7.96881 17.5852 8.18131C18.9133 8.39381 19.9758 9.50944 20.1883 10.7844C20.4539 12.3251 19.657 13.8126 18.2227 14.3969C16.8945 14.9282 16.0445 16.2563 16.0445 17.7969V21.1969C16.0445 21.7282 16.4695 22.1532 17.0008 22.1532C17.532 22.1532 17.957 21.7282 17.957 21.1969V17.7969C17.957 17.0532 18.382 16.3626 18.9664 16.1501C21.1977 15.2469 22.4727 12.9094 22.0477 10.4657C21.6758 8.39381 19.9758 6.69381 17.9039 6.32194Z"
                  />
                  <path
                    d="M17.0531 24.8625H16.8937C16.3625 24.8625 15.9375 25.2875 15.9375 25.8188C15.9375 26.35 16.3625 26.7751 16.8937 26.7751H17.0531C17.5844 26.7751 18.0094 26.35 18.0094 25.8188C18.0094 25.2875 17.5844 24.8625 17.0531 24.8625Z"
                  />
                </svg>
              </div>
              <div class="w-full">
                <h3
                  class="mb-6 text-xl font-semibold text-dark dark:text-white sm:text-2xl lg:text-xl xl:text-2xl"
                >
                  Is TailGrids Well-documented?
                </h3>
                <p class="text-base text-gray-900 dark:text-white">
                  It takes 2-3 weeks to get your first blog post ready. That
                  includes the in-depth research & creation of your monthly
                  content ui/ux strategy that we do writing your first blog
                  post.
                </p>
              </div>
            </div>
            <div class="mb-12 flex lg:mb-[70px]">
              <div
                class="mr-4 flex h-[50px] w-full max-w-[50px] items-center justify-center rounded-xl bg-primary text-white sm:mr-6 sm:h-[60px] sm:max-w-[60px]"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 34 34"
                  class="fill-current"
                >
                  <path
                    d="M17.0008 0.690674C7.96953 0.690674 0.691406 7.9688 0.691406 17C0.691406 26.0313 7.96953 33.3625 17.0008 33.3625C26.032 33.3625 33.3633 26.0313 33.3633 17C33.3633 7.9688 26.032 0.690674 17.0008 0.690674ZM17.0008 31.5032C9.03203 31.5032 2.55078 24.9688 2.55078 17C2.55078 9.0313 9.03203 2.55005 17.0008 2.55005C24.9695 2.55005 31.5039 9.0313 31.5039 17C31.5039 24.9688 24.9695 31.5032 17.0008 31.5032Z"
                  />
                  <path
                    d="M17.9039 6.32194C16.3633 6.05631 14.8227 6.48131 13.707 7.43756C12.5383 8.39381 11.8477 9.82819 11.8477 11.3688C11.8477 11.9532 11.9539 12.5376 12.1664 13.0688C12.3258 13.5469 12.857 13.8126 13.3352 13.6532C13.8133 13.4938 14.0789 12.9626 13.9195 12.4844C13.8133 12.1126 13.707 11.7938 13.707 11.3688C13.707 10.4126 14.132 9.50944 14.8758 8.87194C15.6195 8.23444 16.5758 7.96881 17.5852 8.18131C18.9133 8.39381 19.9758 9.50944 20.1883 10.7844C20.4539 12.3251 19.657 13.8126 18.2227 14.3969C16.8945 14.9282 16.0445 16.2563 16.0445 17.7969V21.1969C16.0445 21.7282 16.4695 22.1532 17.0008 22.1532C17.532 22.1532 17.957 21.7282 17.957 21.1969V17.7969C17.957 17.0532 18.382 16.3626 18.9664 16.1501C21.1977 15.2469 22.4727 12.9094 22.0477 10.4657C21.6758 8.39381 19.9758 6.69381 17.9039 6.32194Z"
                  />
                  <path
                    d="M17.0531 24.8625H16.8937C16.3625 24.8625 15.9375 25.2875 15.9375 25.8188C15.9375 26.35 16.3625 26.7751 16.8937 26.7751H17.0531C17.5844 26.7751 18.0094 26.35 18.0094 25.8188C18.0094 25.2875 17.5844 24.8625 17.0531 24.8625Z"
                  />
                </svg>
              </div>
              <div class="w-full">
                <h3
                  class="mb-6 text-xl font-semibold text-dark dark:text-white sm:text-2xl lg:text-xl xl:text-2xl"
                >
                  Is TailGrids Well-documented?
                </h3>
                <p class="text-base text-gray-900 dark:text-white">
                  It takes 2-3 weeks to get your first blog post ready. That
                  includes the in-depth research & creation of your monthly
                  content ui/ux strategy that we do writing your first blog
                  post.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    
    </section> -->
    <!-- ====== FAQ Section End -->

    <BackToTopBtn/>

    <!-- <MadeWithBtn/> -->
  </div>
</template>
