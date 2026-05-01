<template>
  <div class="min-h-screen bg-gray-900 dark:bg-gray-900 py-4 px-4">
    <h1 class="text-xl md:text-5xl font-extrabold text-center text-gray-100 dark:text-gray-100 mb-8">
      {{ title }}
    </h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 max-w-7xl mx-auto mb-32 sm:mb-0">
      <div
        v-for="(plan, index) in plans"
        :key="plan.id"
        class="relative rounded-2xl shadow-xl p-6 transform transition duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
        @click="selectPlan(plan)"
        :class="[
          colorGradients[index % colorGradients.length].bgClass,
          selectedPlan?.id === plan.id ? 'border-4 border-yellow-500 ring-2 ring-yellow-300' : ''
        ]"
      >
        <span
          class="absolute top-4 right-4 text-2xl"
          :class="colorGradients[index % colorGradients.length].dotClass"
        >
          {{ statusLight[index % statusLight.length] }}
        </span>

        <h2 class="text-xl mb-2 font-bold" :class="colorGradients[index % colorGradients.length].titleClass">
          {{ plan.planName }}
        </h2>

        <p class="mb-4 text-xl font-bold text-yellow-300 dark:text-yellow-300" :class="colorGradients[index % colorGradients.length].textClass">
          {{ plan.finalMoney }} 元 / {{ plan.useDays > 3 * 365 ? '永久' : plan.useDays + "天" }}
        </p>

        <ul class="mb-6 space-y-2" :class="colorGradients[index % colorGradients.length].listClass">
            <li>高速 VPN 访问</li>
            <li>无限流量使用</li>
            <li>7x24 客服支持</li>
        </ul>

      </div>
    </div>

    <div class="col-span-full text-center mt-20 bg-gray-900 w-full m-auto sm:max-w-xs sm:relative sm:mb-4 sm:w-auto sm:max-w-xs fixed bottom-0 left-0 right-0 py-3">
      <div class="mb-4">
        <label class="mr-4 text-white">
          <input
            type="radio"
            v-model="selectedPaymentMethod"
            value="alipay"
            class="mr-2 text-white"
          />
          支付宝
        </label>
        <label class="text-white">
          <input
            type="radio"
            v-model="selectedPaymentMethod"
            value="wxpay"
            class="mr-2 text-white"
          />
          微信
        </label>
      </div>

      <button
        @click="handlePayment"
        :disabled="payLoading"
        class="w-full sm:max-w-xs py-3 text-white font-semibold rounded-lg shadow transition duration-300 hover:shadow-lg bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-500"
      >
        <template v-if="payLoading">提交中..</template>
        <template v-else>立即购买</template>
      </button>
    </div>

    <ModelDialog v-model="qcodeShow" title="请用手机扫描下面二维码进行支付">
      <template #default>
        <div class="mb-4 flex items-center justify-center h-64">
          <canvas ref="qrCanvas" class="block"></canvas>
        </div>
      </template>
      <template #footer>
        <button class="px-4 py-2 rounded bg-gray-100" @click="qcodeShow = false">取消</button>
      </template>
    </ModelDialog>

    <Message message="支付成功!" type="success" v-if="paySuccess" @close="paySuccess = false"/>
    <Message :message="operaErrorMsg" type="warning" v-if="operaError" @close="operaError = false"/>
  </div>
</template>

<script setup lang="ts" >
import { ref, onMounted, watch } from 'vue';
import { Message } from '#components'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'
import QRCode from 'qrcode';

const router = useRouter()
const route = useRoute()

var operaErrorMsg = ref("")
var operaError = ref(false)

var paySuccess = ref(false)

var qcodeShow = ref(false)
const qrCanvas = ref(null);
const plans = ref([]) as any
var selectedPlan = ref({}) as any
const payLoading = ref(false)

var selectedPaymentMethod = ref("alipay")

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

// 2. 定义 Emits
const emit = defineEmits(['purchase']);


// 5. 方法
async function selectPlan(plan:any) {
    selectedPlan.value = plan;  // 更新选中的计划ID
}

onMounted(() => {

  const ua = navigator.userAgent
  
  var accessToken = route.query.access_token;
  if (accessToken) {
      const currentPath = route.path;
      router.replace({ path: currentPath });
  }

  getPlanList()
})

async function getPlanList() {
    const res = await planList()

    if (res.code === 200) {
        plans.value = res.data;
    } 

}


var intervalId : any = null;
async function handlePayment() {

    if (!selectedPlan.value || !selectedPlan.value.id) {
      operaError.value = true
      operaErrorMsg.value = `请选择套餐`;
      return;
    }

    if (!selectedPaymentMethod.value) {
      operaError.value = true
      operaErrorMsg.value = `请选择支付方式`;
      return;
    }

    if (intervalId) {
        clearInterval(intervalId)
    }
    
    payLoading.value = true

    try {

        if (selectedPlan.value) {
            //const selectedPlan = plans.value.find((plan) => plan.id === selectedPlan.value);
            // proxy.$modal.msgSuccess("正在提交支付...");
            var formData = {
                payType: selectedPaymentMethod.value,
                planId: selectedPlan.value.id
            }
            var res = await submitOrder(formData);
            
            if (res.code == 200) {
                var data = res.data
                debugger
                console.log(data.qrcode)
                if (isValidMobile()) {
                  
                    window.location.href = data.qrcode;
                } else {
                    qcodeShow.value = true;
                    //payShow.value = true;
                    // 使用 nextTick 确保在 DOM 更新后再生成二维码
                    await nextTick();
                    // 调用 qrcode 库的 toCanvas 方法生成二维码
                    await QRCode.toCanvas(qrCanvas.value, data.qrcode);

                    intervalId = setInterval(() => {
                        queryOrderRes(data.orderNo)
                    }, 5000);

                    //window.open(data.qrcode)
                }

            } else {
              operaError.value = true
              operaErrorMsg.value = `支付获取失败，请联系客服`;
            }
        // 这里可以跳转到支付页面或调用支付接口
    } 

    } finally {
        payLoading.value = false
    }

}

function isValidMobile() {
    const userAgent = navigator.userAgent.toLowerCase();
    // 常见移动设备关键字
    const mobileKeywords = ['android', 'iphone', 'ipad', 'ipod', 'windows phone'];
    // 检查 User-Agent 中是否包含移动设备关键字
    for (let i = 0; i < mobileKeywords.length; i++) {
        if (userAgent.indexOf(mobileKeywords[i])!== -1) {
            return true;
        }
    }

    return false
}

async function queryOrderRes(orderNo : string) {
    const res = await queryOrder(orderNo)

    if (res.data) {
        paySuccess.value = true;

        if (intervalId) {
          clearInterval(intervalId);
          qcodeShow.value = false;
        }
    } 

}

const colorGradients = [
  // 蓝色主题
  {
    bgClass: 'bg-gradient-to-br from-blue-900 to-blue-800 dark:from-blue-900 dark:to-blue-800',
    dotClass: 'text-blue-300 dark:text-blue-300',
    titleClass: 'text-gray-200 dark:text-gray-200',
    textClass: 'text-gray-400 dark:text-gray-400',
    listClass: 'text-gray-300 dark:text-gray-300',
    btnClass: 'bg-blue-600 hover:bg-blue-600'
  },
  // 绿色主题
  {
    bgClass: 'bg-gradient-to-br from-green-900 to-green-800 dark:from-green-900 dark:to-green-800',
    dotClass: 'text-green-300 dark:text-green-300',
    titleClass: 'text-gray-200 dark:text-gray-200',
    textClass: 'text-gray-400 dark:text-gray-400',
    listClass: 'text-gray-300 dark:text-gray-300',
    btnClass: 'bg-green-600 hover:bg-green-600'
  },
  // 紫色主题
  {
    bgClass: 'bg-gradient-to-br from-purple-900 to-purple-800 dark:from-purple-900 dark:to-purple-800',
    dotClass: 'text-purple-300 dark:text-purple-300',
    titleClass: 'text-gray-200 dark:text-gray-200',
    textClass: 'text-gray-400 dark:text-gray-400',
    listClass: 'text-gray-300 dark:text-gray-300',
    btnClass: 'bg-purple-600 hover:bg-purple-600'
  },
  // 橙色主题
  {
    bgClass: 'bg-gradient-to-br from-orange-900 to-orange-800 dark:from-orange-900 dark:to-orange-800',
    dotClass: 'text-orange-300 dark:text-orange-300',
    titleClass: 'text-gray-200 dark:text-gray-200',
    textClass: 'text-gray-400 dark:text-gray-400',
    listClass: 'text-gray-300 dark:text-gray-300',
    btnClass: 'bg-orange-600 hover:bg-orange-600'
  }
];

onUnmounted(() => {
    if (intervalId) {
        clearInterval(intervalId)
    }
})
</script>

<style scoped>
/* 这里可以放一些组件特有的、需要覆盖的样式 */
/* 由于使用了 Tailwind 和 scoped，大部分样式已经内联或通过 class 控制 */
</style>