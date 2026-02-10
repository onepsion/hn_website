<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- 用户信息模块 -->
        <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div class="bg-gradient-to-br from-blue-900 to-blue-800 dark:from-blue-900 dark:to-blue-800 rounded-xl shadow-lg p-6 transition-all hover:scale-105 hover:shadow-2xl relative">
            <span class="absolute top-3 right-3 text-blue-300 dark:text-blue-300 text-2xl">🆔</span>
            <p class="text-gray-400 dark:text-gray-400 mb-2 text-sm">用户ID</p>
            <p class="text-lg font-semibold text-gray-200 dark:text-gray-200">{{ person.userNo }}</p>
        </div>
        <div class="bg-gradient-to-br from-purple-900 to-purple-800 dark:from-purple-900 dark:to-purple-800 rounded-xl shadow-lg p-6 transition-all hover:scale-105 hover:shadow-2xl relative">
            <span class="absolute top-3 right-3 text-blue-400 dark:text-purple-300 text-2xl">👤</span>
            <p class="text-gray-400 dark:text-gray-400 mb-2 text-sm">用户类型</p>
            <p class="text-lg font-semibold text-gray-200 dark:text-gray-200">{{getMemType(person.memType)}}</p>
        </div>
        <div class="bg-gradient-to-br from-green-900 to-green-800 dark:from-green-900 dark:to-green-800 rounded-xl shadow-lg p-6 transition-all hover:scale-105 hover:shadow-2xl relative">
            <span class="absolute top-3 right-3 text-green-300 dark:text-green-300 text-2xl">🏷️</span>
            <p class="text-gray-400 dark:text-gray-400 mb-2 text-sm">是否代理</p>
            <p class="text-lg font-semibold text-gray-200 dark:text-gray-200">{{getProxyType(person.isProxy)}}</p>
        </div>
        <div class="bg-gradient-to-br from-yellow-900 to-yellow-800 dark:from-yellow-900 dark:to-yellow-800 rounded-xl shadow-lg p-6 transition-all hover:scale-105 hover:shadow-2xl relative">
            <span class="absolute top-3 right-3 text-yellow-300 dark:text-yellow-300 text-2xl">✉️</span>
            <p class="text-gray-400 dark:text-gray-400 mb-2 text-sm">邮箱</p>
            <p class="text-lg font-semibold text-gray-200 dark:text-gray-200 truncate ...">{{person.email}}</p>
        </div>

        <div class="bg-gradient-to-br from-pink-900 to-pink-800 dark:from-pink-900 dark:to-pink-800 rounded-xl shadow-lg p-6 transition-all hover:scale-105 hover:shadow-2xl relative">
            <span class="absolute top-3 right-3 text-pink-400 dark:text-pink-300 text-2xl">🎫</span>
            <p class="text-gray-400 dark:text-gray-400 mb-2 text-sm">邀请码</p>
            <p class="text-lg font-semibold text-gray-200 dark:text-gray-200">{{person.inviterCode}}</p>
        </div>
        <div class="bg-gradient-to-br from-red-900 to-red-800 dark:from-red-900 dark:to-red-800 rounded-xl shadow-lg p-6 transition-all hover:scale-105 hover:shadow-2xl relative">
            <span class="absolute top-3 right-3 text-red-400 dark:text-red-300 text-2xl">⏳</span>
            <p class="text-gray-400 dark:text-gray-400 mb-2 text-sm">到期时间</p>
            <p v-if="Number(person.remainTime) > 3 * 365 * 24 * 60 * 60 * 1000" class="text-lg font-semibold text-gray-200 dark:text-gray-200">永久</p>
            <p v-else class="text-lg font-semibold text-gray-200 dark:text-gray-200">{{ Math.floor(person.remainTime / (24 * 60 * 60 * 1000)) }}天</p>
            
        </div>
        </section>

        <!-- 成为会员模块 -->
        <section class="bg-gray-800 dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 transition-all hover:shadow-xl relative border-t-4 border-yellow-400 dark:border-yellow-500">
            <h4 class="text-xl font-semibold mb-4 text-gray-200 dark:text-gray-200">立即使用</h4>
            <p class="text-gray-400 dark:text-gray-400">开通会员即可享受更多功能和服务。积分可免费兑换时长</p>
            <button @click="tabMenu('pay')" class="mt-4 px-6 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-medium rounded-lg shadow transition duration-300">立即开通/续费</button>

            <button @click="tabMenu('coin')" class="ml-5 mt-4 px-6 py-2 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-medium rounded-lg shadow transition duration-300">积分兑换</button>
        </section>

        <!-- 客户端下载模块 -->
        <section class="bg-gray-800 dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 transition-all hover:shadow-xl relative border-t-4 border-blue-400 dark:border-blue-500">
        <h4 class="text-xl font-semibold mb-4 text-gray-200 dark:text-gray-200">客户端下载</h4>
        <div class="flex flex-wrap gap-4">
            <button class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg shadow transition duration-300" @click="download('windows')">Windows</button>
            <button class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg shadow transition duration-300" @click="download('darwin')">Mac</button>
            <button class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg shadow transition duration-300" @click="download('android')">Android</button>
            <button class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg shadow transition duration-300" @click="download('ios')">iOS</button>
        </div>
        </section>

        <!-- 小伙计订阅管理 -->
        <section class="bg-gray-800 dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 transition-all hover:shadow-xl relative border-t-4 border-purple-500 dark:border-purple-500">
        <h4 class="text-xl font-semibold mb-4 text-gray-200 dark:text-gray-200">获取小伙计订阅 / 重置订阅</h4>
        <div class="flex flex-wrap gap-4">
            <button class="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium rounded-lg shadow transition duration-300" @click="getSub">获取订阅</button>
            <button class="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-lg shadow transition duration-300" @click="resetSub">重置订阅</button>
            <button class="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-medium rounded-lg shadow transition duration-300" @click="goStudy">小火箭下载教程</button>
        </div>
        </section>

        <!-- 邀请人数模块 -->
        <section class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="bg-gray-800 dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all hover:scale-105 hover:shadow-2xl relative">
            <span class="absolute top-3 right-3 text-green-300 dark:text-green-300 text-2xl">📩</span>
            <p class="text-gray-400 dark:text-gray-400 mb-2 text-sm">今日邀请人数</p>
            <p class="text-lg font-semibold text-gray-200 dark:text-gray-200">{{statis.today_invitation_count ?? 0}}</p>
        </div>
        <div class="bg-gray-800 dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all hover:scale-105 hover:shadow-2xl relative">
            <span class="absolute top-3 right-3 text-blue-300 dark:text-blue-300 text-2xl">🌐</span>
            <p class="text-gray-400 dark:text-gray-400 mb-2 text-sm">总共邀请人数</p>
            <p class="text-lg font-semibold text-gray-200 dark:text-gray-200">{{statis.total_invitation_count}}</p>
        </div>
        </section>

        <!-- 用户积分 / 收益模块 -->
        <section class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="bg-gray-800 dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all hover:scale-105 hover:shadow-2xl relative">
            <span class="absolute top-3 right-3 text-yellow-300 dark:text-yellow-300 text-2xl">💎</span>
            <p class="text-gray-400 dark:text-gray-400 mb-2 text-sm">用户积分</p>
            <p class="text-lg font-semibold text-gray-200 dark:text-gray-200">{{person.coin}}</p>
        </div>
        <div class="bg-gray-800 dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all hover:scale-105 hover:shadow-2xl relative">
            <span class="absolute top-3 right-3 text-green-300 dark:text-green-300 text-2xl">💰</span>
            <p class="text-gray-400 dark:text-gray-400 mb-2 text-sm">用户收益</p>
            <p class="text-lg font-semibold text-gray-200 dark:text-gray-200">￥{{person.balance}}</p>
        </div>
        </section>


        <Message message="订阅复制成功!" type="success" v-if="subSuccess" @close="subSuccess = false"/>
        <Message message="操作成功!" type="success" v-if="operaSuccess" @close="operaSuccess = false"/>
        <Message message="订阅获取失败,请重试" type="error" v-if="subError" @close="subError = false"/>
    </div>
</template>

<script setup lang="ts" >
import { ref, onMounted, watch } from 'vue';
import useClipboard from 'vue-clipboard3';
const { toClipboard } = useClipboard();
import { useRouter } from 'vue-router'
var person = ref({}) as any
const auth = useAuthStore()

const router = useRouter()
const route = useRoute()

var operaSuccess = ref(false)
var subSuccess = ref(false)
var subError = ref(false)

const downloadLinks = ref<{
  [key: string]: string;
}>({
  windows: '',
  macos: '',
  android: '',
  ios: ''
});

var statis = ref({}) as any

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


const emit = defineEmits(['menu']);

onMounted(() => {

    getPerson()

    getStatis()

    getDownLoad()

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

async function getStatis() {
    const res = await myInvitStatis()

    if (res.code === 200) {
        statis = res.data
    } 
}

async function getDownLoad() {
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
    
}

function tabMenu(key: string) {
    emit('menu', key);
}

function getMemType(val : string) {
    if (val === "0") {
        return "游客"
    }else if (val == "1") {
        return "普通"
    }else if (val == "2") {
        return "会员"
    }else {
        return "-"
    }

}

function download(name : string) {
    var downObj = downloadLinks.value;
    window.location.href = downObj[name]
}

async function resetSub() {
    const res = await restMyLink()

    if (res.code === 200) {
        operaSuccess.value = true
    }

}

const getSub = async () => {

    try {

        const res = await auth.fetchUser()

        if (res.code === 200) {
            
            var persion = res.data;

            await toClipboard(persion.config.subUrl + "/subscr/shadowrocket/" + persion.link);
            //navigator.clipboard.writeText(persion.config.subUrl + "/subscr/shadowrocket/" + persion.link);

            subSuccess.value = true;
        } else {
            subError.value = true;
        }


    } catch (err) {
        subError.value = true;
    }
}

function getProxyType(val : boolean) {
    if (!val) {
        return "否"
    }else {
        return "是"
    }
}

function goStudy() {
  router.push('/ios')
}

</script>

<style scoped>
/* 这里可以放一些组件特有的、需要覆盖的样式 */
/* 由于使用了 Tailwind 和 scoped，大部分样式已经内联或通过 class 控制 */
</style>