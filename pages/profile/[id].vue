<template>
  <div class="flex h-screen bg-gray-900 dark:bg-gray-900 transition-colors relative">

    <!-- 移动端顶部栏 -->
    <header class="md:hidden w-full bg-gray-800 dark:bg-gray-800 flex items-center justify-between p-4 shadow-md fixed top-0 z-30">
      <div class="flex items-center space-x-2">
        <!-- 返回首页按钮 -->
        <button
          @click="$router.push('/')"
          class="flex items-center px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg shadow transition duration-300"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 18l-6-6 6-6"></path>
          </svg>
          首页
        </button>
        
      </div>
      <button @click="showMobileMenu = !showMobileMenu" class="text-gray-300 dark:text-gray-300 text-2xl">
        ☰
      </button>
    </header>

    <!-- 移动端抽屉 + 遮罩 -->
    <transition name="slide">
      <div v-if="showMobileMenu" class="fixed inset-0 z-40 flex">
        <!-- 遮罩 -->
        <div class="fixed inset-0 bg-black/40" @click="showMobileMenu = false"></div>
        <!-- 抽屉 -->
        <aside class="relative w-64 bg-gray-800 dark:bg-gray-800 p-6 shadow-lg overflow-auto">
          <h2 class="text-xl font-bold text-gray-200 dark:text-gray-200 mb-4">菜单</h2>
          <ul class="space-y-2">
            <li
              v-for="item in menuList"
              :key="item.key"
              @click="selectMenu(item.key)"
              class="flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200"
              :class="activeMenu === item.key
                ? 'bg-yellow-500 text-white shadow-md scale-105'
                : 'text-gray-300 dark:text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-700'">
              <span class="text-lg mr-3">{{ item.icon }}</span>
              <span class="font-medium text-sm">{{ item.label }}</span>
            </li>
          </ul>
          <button
            @click="logout"
            class="mt-6 w-full flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg shadow transition duration-300"
          >
            退出登录
          </button>
        </aside>
      </div>
    </transition>

    <!-- 左侧菜单（桌面端） -->
    <aside class="hidden md:flex w-64 bg-gray-800 dark:bg-gray-800 border-r border-gray-700 dark:border-gray-700 p-6 flex-col rounded-r-2xl shadow-lg">
      <h2 class="text-xl font-bold text-gray-200 dark:text-gray-200 mb-6">个人中心</h2>
      <ul class="flex-1 space-y-2">
        <li
          v-for="item in menuList"
          :key="item.key"
          @click="selectMenu(item.key)"
          class="flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200"
          :class="activeMenu === item.key
            ? 'bg-yellow-500 text-white shadow-md scale-105'
            : 'text-gray-300 dark:text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-700'">
          <span class="text-lg mr-3">{{ item.icon }}</span>
          <span class="font-medium text-sm">{{ item.label }}</span>
        </li>
      </ul>
      <!-- <div class="mt-auto text-gray-400 dark:text-gray-500 text-xs">版本 1.0.0</div> -->
      <button
        @click="logout"
        class="mt-6 flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg shadow transition duration-300"
      >
        退出登录
      </button>
    </aside>

    <!-- 右侧内容 -->
    <main class="flex-1 md:pt-8 p-4 md:p-8 overflow-auto bg-gray-900 dark:bg-gray-900" :class="mobileHeaderShow ? 'pt-20' : ''">
      <!-- 页面顶部：返回按钮 + 标题 -->
      <div class="hidden md:block mb-6 flex items-center space-x-4">
        <button
          @click="$router.push('/')"
          class="flex items-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg shadow-md transition duration-300"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 18l-6-6 6-6"></path>
          </svg>
          返回首页
        </button>
        <!-- <h3 class="text-3xl font-bold text-gray-800 dark:text-gray-200">个人信息</h3> -->
      </div>

      <!-- 个人信息内容 -->
      <div v-if="activeMenu === 'person'">
          <AppPerson class="mt-20" @menu ="selectMenu"/>
      </div>
      <!-- 其他菜单同理 -->

      <div v-if="activeMenu === 'pay'">
          <AppPayNew />
      </div>

      <div v-if="activeMenu === 'order'">
    
                <!-- <div class="min-h-screen bg-gray-900 dark:bg-gray-900 p-6 font-sans">
                    <h1 class="text-3xl font-bold text-gray-200 dark:text-gray-200 mb-6">我的订单</h1>

                    
                    <div class="grid grid-cols-1 gap-6">
                        <div
                        v-for="order in orders"
                        :key="order.id"
                        class="relative rounded-2xl shadow-xl p-6 transform transition duration-300 hover:scale-105 hover:shadow-2xl bg-white dark:bg-gray-800 flex flex-col"
                        >
                   
                        <span
                            :class="[
                            'absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium',
                            order.status === '已支付' ? 'bg-green-800 text-green-100 dark:bg-green-800 dark:text-green-100' :
                            order.status === '未支付' ? 'bg-yellow-800 text-yellow-100 dark:bg-yellow-800 dark:text-yellow-100' :
                            'bg-red-800 text-red-100 dark:bg-red-800 dark:text-red-100'
                            ]"
                        >
                            {{ order.status }}
                        </span>

                        <div class="flex items-center space-x-4">
                       
                            <div class="text-xl">{{ order.icon }}</div>

                   
                            <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <h2 class="text-xl font-bold text-gray-200 dark:text-gray-200">{{ order.plan }}</h2>
                            <p class="text-gray-400 dark:text-gray-400">价格：{{ order.price }} 元</p>
                            <p class="text-gray-400 dark:text-gray-400">购买时间：{{ order.date }}</p>
                            <p class="text-gray-400 dark:text-gray-400">有效期：{{ order.duration }}</p>
                            </div>
                        </div>

                        <div class="mt-4 flex flex-wrap gap-2 justify-end">
                            <button class="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow transition duration-300">
                            🛒 详情
                            </button>
                            <button
                            v-if="order.status === '未支付'"
                            class="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg shadow transition duration-300"
                            >
                            💳 立即支付
                            </button>
                        </div>
                        </div>
                    </div>


                    
                </div> -->

      </div>

      <div v-if="activeMenu === 'coin'">
            <AppCoin />
      </div>
    </main>


    <!-- <Message message="订阅复制成功!" type="success" v-if="subSuccess" @close="subSuccess = false"/>
    <Message message="操作成功!" type="success" v-if="operaSuccess" @close="operaSuccess = false"/>
    <Message message="订阅获取失败,请重试" type="error" v-if="subError" @close="subError = false"/>
    <Message message="支付成功!" type="success" v-if="paySuccess" @close="paySuccess = false"/>
    <Message :message="convertSuccessMsg" type="success" v-if="convertSuccess" @close="convertSuccess = false"/>
    <Message :message="operaErrorMsg" type="warning" v-if="operaError" @close="operaError = false"/> -->


  </div>
</template>

<script setup lang="ts">

//拦截判断页面是否需要登录才能访问
definePageMeta({
  middleware: 'common'
})

import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()

const router = useRouter()
const route = useRoute()
var mobileHeaderShow = ref(true)

const activeMenu = ref('')
const showMobileMenu = ref(false)

const menuList = [
  { key: 'person', label: '个人信息', icon: '👤' },
  { key: 'pay', label: '套餐计划', icon: '💰' },
  { key: 'coin', label: '积分兑换', icon: '🪙' }
  // { key: 'order', label: '我的订单', icon: '🛒' }

]




onMounted(() => {


  const ua = navigator.userAgent
  
  if (/Android/i.test(ua)) {
    mobileHeaderShow.value = false
  } else if (/iPhone|iPad|iPod/i.test(ua)) {
    mobileHeaderShow.value = false
  } 

  var accessToken = route.query.access_token;
  if (accessToken) {
      const currentPath = route.path;
      router.replace({ path: currentPath });
  }

  activeMenu.value = route.params.id as string;
  // if (route.params.id == "pay") {
  //     getPlanList()
  // } else if (route.params.id == "person") {
  //     getPerson()

  //     getStatis()

  //     getDownLoad()
  // }else if (route.params.id === "coin") {
  //   getPerson()
  //   getDurtionList()
  // }

})

function selectMenu(key: string) {
  activeMenu.value = key
  showMobileMenu.value = false
}

function logout() {
  auth.logout()
  showMobileMenu.value = false
  router.push('/login')
}
</script>

<style>
/* 抽屉动画 */
.slide-enter-from { transform: translateX(-100%); }
.slide-enter-to { transform: translateX(0); }
.slide-leave-from { transform: translateX(0); }
.slide-leave-to { transform: translateX(-100%); }
.slide-enter-active,
.slide-leave-active { transition: transform 0.3s ease; }
</style>
