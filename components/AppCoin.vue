<template>
    <div class="min-h-screen p-6 rounded-2xl
        bg-gradient-to-b  from-gray-900 via-gray-800 to-gray-700
        dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
        
        <!-- 页面标题 -->
        <h1 class="text-4xl font-bold text-center text-gray-100 dark:text-gray-100 mb-10 drop-shadow-md">
        积分兑换时长 ⏰
        </h1>

        <!-- 积分信息 -->
        <div class="max-w-4xl mx-auto mb-8 p-6 
                    bg-gray-800 dark:bg-gray-800 rounded-2xl shadow-lg flex justify-between items-center">
        <div>
            <p class="text-gray-300 dark:text-gray-300">当前积分</p>
            <p class="text-3xl font-bold text-indigo-400 dark:text-indigo-400">{{person.coin}} 🪙</p>
        </div>
        <button  @click="openDialog"
            class="bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 
                text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all duration-300">
            获取积分
        </button>
        </div>

        <!-- 积分兑换时长列表 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
            v-for="item in durations" 
            :key="item.days" 
            class="relative bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 
                    dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 
                    rounded-2xl shadow-lg hover:shadow-2xl p-6 
                    transform hover:-translate-y-2 hover:scale-[1.02] 
                    transition-all duration-300">

            <!-- 点缀 -->
            <div class="absolute top-4 right-4 text-yellow-400 text-2xl animate-bounce">✨</div>

            <!-- 内容 -->
            <div class="text-center mb-6 space-y-2">
                <!-- 明确兑换内容 -->
                <p class="text-xl font-medium text-gray-300 dark:text-gray-300">
                兑换时长
                </p>
                <p class="text-3xl font-bold text-gray-100 dark:text-gray-100 tracking-wide">
                {{ item.name }}
                </p>

                <!-- 明确消耗积分 -->
                <p class="text-base text-gray-300 dark:text-gray-300">
                需要消耗 
                <span class="text-lg font-semibold text-pink-400 dark:text-pink-400">
                    {{ item.coin }} 积分
                </span>
                </p>
            </div>

            <!-- 按钮 -->
            <button 
                :disabled="person.coin < item.coin || loadingId === item.id"
                @click="exchange(item)"
                class="w-full bg-gradient-to-r from-pink-600 to-purple-600 
                    hover:from-purple-600 hover:to-pink-600 
                    dark:from-pink-600 dark:to-purple-600 
                    dark:hover:from-purple-600 dark:hover:to-pink-600 
                    text-white font-semibold py-3 rounded-xl 
                    shadow-md hover:shadow-lg 
                    disabled:opacity-50 disabled:cursor-not-allowed 
                    transition-all duration-300">
                <span v-if="loadingId === item.id">兑换中..</span>
                <span v-else>立即兑换</span>
            </button>
            </div>
   


        </div>

    
        <!-- 遮罩层 -->
    <div 
      v-if="showDialog"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div 
        class="bg-gray-800 dark:bg-gray-800 rounded-2xl shadow-xl w-11/12 max-w-sm p-6 relative"
      >
        <!-- 内容 -->
        <h2 class="text-xl font-semibold text-gray-100 dark:text-gray-100 mb-4">
          🎉 获取积分
        </h2>
        <p class="text-gray-300 dark:text-gray-300 mb-6">
          用户您可以在官网下载手机客户端,可以每日完成活动任务，每次完成任务可获取对应的积分，限时活动不要错过哟
        </p>

        <!-- 按钮 -->
        <div class="flex justify-end">
          <button 
            @click="closeDialog"
            class="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg shadow-md transition-all duration-300">
            知道了
          </button>
        </div>
      </div>
    </div>
    </div>
    <Message message="操作成功!" type="success" v-if="operaSuccess" @close="operaSuccess = false"/>
    <Message message="订阅获取失败,请重试" type="error" v-if="subError" @close="subError = false"/>
    <Message :message="convertSuccessMsg" type="success" v-if="convertSuccess" @close="convertSuccess = false"/>
    <Message :message="operaErrorMsg" type="warning" v-if="operaError" @close="operaError = false"/>

</template>

<script setup lang="ts" >
import { ref, onMounted, watch } from 'vue';

import { useRouter } from 'vue-router'
var person = ref({}) as any
const auth = useAuthStore()

const router = useRouter()
const route = useRoute()

const loadingId = ref<number | null>(null)

var operaSuccess = ref(false)
var subSuccess = ref(false)
var subError = ref(false)
var convertSuccess = ref(false)
var convertSuccessMsg = ref("")
var operaErrorMsg = ref("")
var operaError = ref(false)

const showDialog = ref(false)
// 积分兑换时长配置
const durations = ref([]) as any


// 1. 定义 Props
const props = defineProps({
  title: {
    type: String,
    default: '套餐购买'
  },
  statusLight: {
    type: Array,
    default: () => ['●', '●', '●'] // 默认状态点
  }
});


const emit = defineEmits(['clickMenu']);

onMounted(() => {
    getPerson()
    getDurtionList()

})
async function getPerson() {
    const res = await auth.fetchUser()

    if (res.code === 200) {
        person.value = res.data;
    } else {
      router.push('/login')
      return res;
    }
}

async function getDurtionList() {
    const res = await getDurList()

    if (res.code === 200) {
        durations.value = res.data;
    } 
}

async function exchange(item: any) {
  // 点击后立刻禁用
  loadingId.value = item.id
  try {

    const res = await convertDur({convertId : item.id})

    if (res.code == 200) {
      convertSuccess.value = true
      convertSuccessMsg.value = `兑换成功！你获得了 ${item.duration} 天的使用时长 🎉`;
      getPerson()
    } else if (res.code == 850) {
      operaError.value = true
      operaErrorMsg.value = `充值使用时长未到期，无法兑换`;
    } else if (res.code == 853) {
      operaError.value = true
      operaErrorMsg.value = `赠送使用时长未到期，无法兑换`;
    } else if (res.code == 851) {
      operaError.value = true
      operaErrorMsg.value = `兑换码兑换时长未到期，无法兑换`;
    } else if (res.code == 852) {
      operaError.value = true
      operaErrorMsg.value = `积分兑换使用时长未到期，无法兑换`;
    } else {
      //operaError.value = true
      //operaErrorMsg.value = `系统错误`;
    }

  } finally {
    loadingId.value = null
  }
  
}


const openDialog = () => {
  showDialog.value = true
}
const closeDialog = () => {
  showDialog.value = false
}
</script>