<template>
    <div class="bg-white/80 dark:bg-gray-900/90">
    <div class="max-w-3xl mx-auto px-4 py-8 space-y-6 ">

        <!-- 提示 -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 text-gray-800 dark:text-gray-100">
             提示：按照下面步骤建议下载并安装两款软件（小火箭和telegram），小火箭用于科学上网，telegram用于聊天。安装这两款软件，由于国内App Store 无法下载，只能通过国外App Store账号登陆后进行下载，以下是安装步骤
        </div>

        <!-- 海外App Store账号 -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 space-y-2">
        <div class="flex justify-between items-center">
            <span class="font-semibold text-gray-800 dark:text-gray-100">海外App Store账号</span>
            <button @click="show = !show" class="text-gray-500 dark:text-gray-300">
            <span v-if="show">▲</span>
            <span v-else>▼</span>
            </button>
        </div>

        <div class="flex items-center space-x-2 text-gray-800 dark:text-gray-100">
            <span class="truncate">{{ appAccount[0]?.appleAccount }}</span>
            <button @click="copy($event, appAccount[0]?.appleAccount)" class="text-blue-500 hover:underline">复制账号</button>
            <button @click="copy($event, appAccount[0]?.applePassword)" class="text-blue-500 hover:underline">复制密码</button>
        </div>

        <transition name="fade">
            <div v-show="show" class="space-y-2 mt-2 text-gray-800 dark:text-gray-100">
            <div v-for="(item, index) in appAccountHide" :key="index" class="flex items-center space-x-2">
                <span class="truncate">{{ item.appleAccount }}</span>
                <button @click="copy($event, item.appleAccount)" class="text-blue-500 hover:underline">复制账号</button>
                <button @click="copy($event, item.applePassword)" class="text-blue-500 hover:underline">复制密码</button>
            </div>
            </div>
        </transition>
        </div>

        <!-- 分割线 -->
        <div class="relative my-6">
        <hr class="border-gray-300 dark:border-gray-600" />
        <span class="absolute left-2 top-0 bg-white dark:bg-gray-800 px-2 text-gray-700 dark:text-gray-300 font-semibold">开始（一定要注意！！）</span>
        </div>

        <!-- 图片步骤 -->
        <div class="space-y-4">
        <div v-for="(img, index) in stepImages" :key="index" class="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
            <img :src="img" class="w-full object-cover" />
        </div>
        </div>

        <!-- Telegram下载提示 -->
        <!-- <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 flex items-center space-x-4">
        <img :src="telegram" alt="Telegram" class="w-16 h-16 object-contain" />
        <span class="text-gray-800 dark:text-gray-100">Telegram下载：方便和客服进行沟通（建议下载）</span>
        </div> -->

        <!-- 回到顶部 -->
        <button @click="scrollToTop" class="fixed bottom-6 right-6 bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-full shadow-lg">
        ↑
        </button>
    </div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import img0 from '@/assets/images/0.jpg'
import img1 from '@/assets/images/1.jpg'
import img2 from '@/assets/images/2.jpg'
import img31 from '@/assets/images/3-1.jpg'
import img32 from '@/assets/images/3-2.jpg'
import img33 from '@/assets/images/3-3.jpg'
import img4 from '@/assets/images/4.jpg'
import img5 from '@/assets/images/5.jpg'
import img6 from '@/assets/images/6.png'
import img7 from '@/assets/images/7.jpg'
import img8 from '@/assets/images/8.jpg'
import img9 from '@/assets/images/9.jpg'
import img10 from '@/assets/images/10.jpg'
import img11 from '@/assets/images/11.jpg'
import img12 from '@/assets/images/12.jpg'
import img13 from '@/assets/images/13.jpg'
import img14 from '@/assets/images/14.jpg'
import telegram from '@/assets/images/telegram.png'
import Clipboard from 'clipboard'

const show = ref(false)
const appAccount = ref([])
const appAccountHide = ref([])

const stepImages = [img0,img1,img2,img31,img32,img33,img4,img5,img6,img7,img8,img9,img10,img11,img12,img13,img14]

const copy = (event, text) => {
  const clipboard = new Clipboard(event.target, { text: () => text })
  clipboard.on('success', e => {
    alert('复制成功')
    clipboard.destroy()
  })
  clipboard.on('error', e => {
    alert('复制失败，浏览器不支持')
    clipboard.destroy()
  })
  clipboard.onClick(event)
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  listAppleAcc().then(res => {
    if (res.code === 200) {
      appAccount.value = res.rows
      appAccountHide.value = res.rows.slice(1)
    }
  })
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
