<script setup lang="ts">
useHead({
  title: '黄鸟加速器 | 欢迎使用黄鸟加速器',
  meta: [
    { name: 'description', content: '黄鸟加速 - 突破网络限制，提供高速专线服务，畅享专业、安全、极速的网络体验，支持Windows, Macos, Android, IOS系统，永久免费使用。' }
  ],
})

const localePath = useLocalePath()

const { locale } = useI18n()

const downloadLinks = ref<{
  [key: string]: string;
}>({
  windows: '',
  macos: '',
  android: '',
  ios: ''
});

const res = await querySettings()

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

</script>

<template>
  <!-- ====== Banner Section Start -->
   <div class="bg-white/80 dark:bg-gray-900/90">
      <div class="p-5 relative z-10 overflow-hidden max-w-7xl mx-auto w-auto">
        <!-- <div
          class="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-stroke/0 via-stroke dark:via-dark-3 to-stroke/0">
        </div> -->
        <div class="mx-auto w-auto p-4">
          <div class="flex flex-wrap items-center -mx-4">
            <div class="w-full px-4">
              <div class="text-center">
                <ul class="flex items-center justify-left gap-[10px]">
                  <li>
                    <NuxtLink to="/"
                      class="flex items-center gap-[10px] text-base font-medium text-gray-900 dark:text-white">
                      首页
                    </NuxtLink>
                  </li>
                  <li>
                    <a href="javascript:void(0)" class="flex items-center gap-[10px] text-base font-medium text-gray-900 dark:text-white">
                      <span class="text-gray-900 dark:text-white"> / </span>
                      下载
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
  <!-- ====== Banner Section End -->

<!-- ====== Pricing Section Start -->
     <div class="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col items-center justify-center">
      <!-- 标题 -->
      <h1 class="pt-10 text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-3 text-center">
        🚀 客户端下载
      </h1>

      <!-- 副标题 -->
      <p class="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 mb-6 text-center max-w-xl mx-auto">
        请选择适合您设备的版本，安全、稳定、快速连接全球网络。
      </p>


    <!-- 主下载按钮 -->
    <!-- <a
      :href="downloadLinks[mainType] || '#'"
      class="rounded-xl bg-yellow-500 px-6 py-3 text-lg font-semibold text-gray-900 dark:text-white shadow-lg hover:bg-yellow-600 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors duration-300"
    >
      {{ mainText }}
    </a> -->

    <!-- 备用下载列表 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 w-full max-w-5xl">
      <!-- Android -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 flex flex-col items-center hover:shadow-xl transition">
        <span class="text-4xl">🤖</span>
        <h2 class="text-lg font-bold mt-4 text-gray-800 dark:text-white">Android</h2>
        <p class="text-gray-500 text-sm mt-2">适用于安卓手机和平板</p>
        <a
          :href="downloadLinks.android"
          class="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
        >
          下载 APK
        </a>
      </div>

      <!-- iOS -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 flex flex-col items-center hover:shadow-xl transition">
        <span class="text-4xl">🍎</span>
        <h2 class="text-lg font-bold mt-4 text-gray-800 dark:text-white">iOS</h2>
        <p class="text-gray-500 text-sm mt-2">适用于 iPhone 和 iPad</p>
        <a
          :href="downloadLinks.ios"
          class="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          App Store
        </a>
      </div>

      <!-- Windows -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 flex flex-col items-center hover:shadow-xl transition">
        <span class="text-4xl">🖥️</span>
        <h2 class="text-lg font-bold mt-4 text-gray-800 dark:text-white">Windows</h2>
        <p class="text-gray-500 text-sm mt-2">适用于 Windows 7/10/11</p>
        <a
          :href="downloadLinks.windows"
          class="mt-4 inline-block bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
        >
          下载 EXE
        </a>
      </div>

      <!-- macOS -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 flex flex-col items-center hover:shadow-xl transition">
        <span class="text-4xl">🍏</span>
        <h2 class="text-lg font-bold mt-4 text-gray-800 dark:text-white">macOS</h2>
        <p class="text-gray-500 text-sm mt-2">适用于 macOS 12+</p>
        <a
          :href="downloadLinks.macos"
          class="mt-4 inline-block bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition"
        >
          下载 DMG
        </a>
      </div>
    </div>
  </div>
</template>

<style>

</style>