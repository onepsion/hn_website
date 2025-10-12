<script setup lang="ts">
useHead({
  title: '黄鸟加速器 | 欢迎使用黄鸟加速器',
  meta: [
    { name: 'description', content: '黄鸟加速 - 突破网络限制，提供高速专线服务，畅享专业、安全、极速的网络体验，支持Windows, Macos, Android, IOS系统，永久免费使用。' }
  ],
})

const localePath = useLocalePath()

const { locale } = useI18n()

// import MarkdownIt from 'markdown-it'

// const md = new MarkdownIt()

// // 渲染成 HTML
// function renderMarkdown(markdown) {
//   return md.render(markdown || '')
// }
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
                      Home
                    </NuxtLink>
                  </li>
                  <li>
                    <a href="javascript:void(0)" class="flex items-center gap-[10px] text-base font-medium text-gray-900 dark:text-white">
                      <span class="text-gray-900 dark:text-white"> / </span>
                      Price
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
     <div class="bg-gray-100/50 dark:bg-gray-900/90">
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
    </div>

    
</template>

<style>

</style>