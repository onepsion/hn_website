<template>
  <div class="w-full min-h-screen bg-gray-900 p-4">
    <div class="bg-gray-800 shadow-2xl rounded-lg overflow-hidden">
      <div class="bg-gray-950/10 text-white text-center py-4 rounded-t-lg">
        <h2 class="text-lg font-bold">使用设备</h2>
      </div>

      <div class="divide-y divide-gray-700">
        <div v-if="!loading && devices.length === 0" class="p-8 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1v-3.25m-7.25-10.5L9 20l-1 1h8l-1-1v-3.25m-3.5-13V4.75m0 0V3m0 0v1.75m0 0h1.75m-1.75 0H7m11 0h1.75m-1.75 0H15m0 0V3m0 0v1.75m0 0V3m0 0v1.75"/>
          </svg>
          <h3 class="mt-2 text-sm font-semibold text-white">暂无设备记录</h3>
          <p class="mt-1 text-xs text-gray-400">
            你目前没有已登录的设备，或设备数据正在加载中。
          </p>
        </div>

        <div
          v-else
          v-for="device in devices"
          :key="device.deviceId"
          class="flex items-start justify-between p-4 space-x-4 bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          <div class="flex items-start space-x-3 w-full">
            <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-indigo-700 rounded-full text-lg text-white mt-0.5">
              <span>{{ device.deviceType === 'windows' ? '💻' : device.deviceType === 'android' ? '📱' : '🍏' }}</span>
            </div>
            
            <div class="flex flex-col flex-grow min-w-0">
              <span class="text-sm font-medium text-white" style="word-break: break-all;">
                设备ID: {{ device.deviceId }}
              </span>
              
              <span class="text-xs text-gray-400 mt-1">最后使用: {{ formatUseTime(device.useTime) }}</span>
            </div>
          </div>
          
          <div 
            class="flex-shrink-0 mt-0.5 px-2 py-0.5 rounded-full text-xs font-semibold self-start"
            :class="device.online 
              ? 'bg-green-700 text-green-100'
              : 'bg-gray-700 text-gray-300'" 
          >
            <span>{{ device.online ? '在线' : "离线" }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
//拦截判断页面是否需要登录才能访问
import { useRouter} from 'vue-router'
const router = useRouter()
const route = useRoute()
definePageMeta({
  layout: 'nohead',
  middleware: 'common'
})


const loading = ref(true)
// 设备数据（保持不变）
const devices = ref([
])


onMounted( async () => {

    try{

        var accessToken = route.query.access_token;
        if (accessToken) {
            const currentPath = route.path;
            router.replace({ path: currentPath });
        }


        const res = await queryDeviceList()

        if (res.code == 200) {
        
            devices.value = res.data
        } 

    } finally {
        loading.value = false
    }
    
})

// 辅助函数：格式化使用时间，更简洁的显示（保持不变）
const formatUseTime = (timestamp) => {
    // 1. 确保输入是数字（如果数据是字符串形式的时间戳）
    const ts = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;
    
    // 2. 假设时间戳是毫秒（如果您的时间戳是秒，请取消下一行的注释）
    // const ts_in_ms = ts * 1000;
    const date = new Date(ts);
    
    // 3. 提取日期和时间组件
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    // 4. 组合成 yyyy-MM-dd HH:mm:ss 格式
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
</script>

<style scoped>
/* 确保长 ID 在没有空格的情况下也能换行，这是手机端显示长 UUID/ID 的常用做法 */
.min-w-0 {
    min-width: 0; /* 确保 flex item 能够正确收缩 */
}
</style>