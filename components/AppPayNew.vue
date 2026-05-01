<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import QRCode from 'qrcode'
import { useAuthStore } from '~/stores/auth'
import { useApiFetch } from '~/utils/request'

type PlanId = number | string

type PlanInfo = {
  id: PlanId
  planName?: string
  finalMoney?: string | number
  useDays?: number
  planDesc?: string
}

type UserPlanResult = {
  planType?: number
  planList?: PlanInfo[]
}

type SubmitOrderResult = {
  orderNo?: string
  qrcode?: string
}

type ApiResponse<T> = {
  code: number
  msg?: string
  data?: T
}

type PayType = 'alipay' | 'wxpay'
type ToastType = 'success' | 'error' | 'warning' | 'info'

const POLL_INTERVAL_MS = 5000
const MAX_POLL_ATTEMPTS = 24
const PLAN_TYPE_NEW_USER = 0
const PROMO_PLAN_ID = 10001
const LIFETIME_PLAN_ID = 10005
const PAY_METHOD_LABELS: Record<PayType, string> = {
  alipay: '支付宝',
  wxpay: '微信支付'
}

const router = useRouter()
const auth = useAuthStore()

const loading = ref(false)
const submitLoading = ref(false)
const planList = ref<PlanInfo[]>([])
const currentPlanType = ref<number | null>(null)
const selectedPlanId = ref<PlanId | null>(null)
const payMethodOpen = ref(false)
const payQrOpen = ref(false)
const payQrUrl = ref('')
const payQrDataUrl = ref('')
const payQrOrderNo = ref('')
const currentPayType = ref<PayType | ''>('')
const pollingOrderNo = ref('')
const pollAttempts = ref(0)
const toast = ref<{ key: number; type: ToastType; message: string } | null>(null)

let toastKey = 0
let pollTimer: number | null = null

const currentPlanMap = computed(() => {
  const map = new Map<string, PlanInfo>()
  for (const item of planList.value) map.set(String(item.id), item)
  return map
})

const hasKeyword = (value: string | undefined, keywords: string[]) => {
  if (!value) return false
  return keywords.some((keyword) => value.includes(keyword))
}

const parseMoney = (value?: string | number | null) => {
  const num = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(num) ? num : 0
}

const isLifetimePlan = (plan: PlanInfo) => {
  return (
    String(plan.id) === String(LIFETIME_PLAN_ID) ||
    (plan.useDays != null && plan.useDays > 3650) ||
    hasKeyword(plan.planName, ['永久', '终身']) ||
    hasKeyword(plan.planDesc, ['永久', '终身'])
  )
}

const isPromoPlan = (plan: PlanInfo) => {
  const amount = parseMoney(plan.finalMoney)
  return (
    String(plan.id) === String(PROMO_PLAN_ID) ||
    amount === 99 ||
    hasKeyword(plan.planName, ['福利', '活动', '新用户', '99']) ||
    hasKeyword(plan.planDesc, ['福利', '活动', '新用户', '限购']) ||
    ((plan.useDays ?? 0) >= 120 && amount > 0 && amount <= 120)
  )
}

const isNewUserPlanType = computed(() => currentPlanType.value === PLAN_TYPE_NEW_USER)
const promoPlan = computed(() =>
  isNewUserPlanType.value ? planList.value.find((item) => isPromoPlan(item) && !isLifetimePlan(item)) ?? null : null
)
const lifetimePlan = computed(() =>
  isNewUserPlanType.value ? planList.value.find((item) => isLifetimePlan(item)) ?? null : null
)
const normalPlans = computed(() =>
  isNewUserPlanType.value
    ? planList.value.filter((item) => item.id !== promoPlan.value?.id && item.id !== lifetimePlan.value?.id)
    : planList.value
)
const selectedPlan = computed(() =>
  selectedPlanId.value != null ? currentPlanMap.value.get(String(selectedPlanId.value)) ?? null : null
)

const buyButtonText = computed(() => {
  if (submitLoading.value) return '提交中...'
  if (!selectedPlan.value) return '请选择套餐'
  return `立即购买 ¥${formatMoney(selectedPlan.value.finalMoney)}`
})
const currentPayMethodName = computed(() =>
  currentPayType.value ? PAY_METHOD_LABELS[currentPayType.value] : '支付应用'
)
const payQrTitle = computed(() => `${currentPayMethodName.value}扫码支付`)

const isSelected = (plan: PlanInfo | null) => {
  return plan != null && selectedPlanId.value != null && String(selectedPlanId.value) === String(plan.id)
}

const showMessage = (message: string, type: ToastType = 'info') => {
  toast.value = { key: ++toastKey, type, message }
}

const request = async <T = any>(method: 'GET' | 'POST', path: string, body?: any) => {
  return useApiFetch(path, {
    method,
    body
  }) as Promise<ApiResponse<T>>
}

const isLoggedIn = () => {
  if (auth.isLoggedIn) return true
  return !!auth.initAuth()
}

const ensureLogin = () => {
  if (isLoggedIn()) return true
  showMessage('请先登录后购买套餐', 'warning')
  void router.push('/login')
  return false
}

const loadPlanList = async () => {
  if (!isLoggedIn()) {
    currentPlanType.value = null
    planList.value = []
    selectedPlanId.value = null
    ensureLogin()
    return
  }

  loading.value = true
  try {
    const body = await request<UserPlanResult>('GET', '/plan/query/current')
    if (body?.code !== 200 || !body.data) {
      showMessage(body?.msg || '套餐加载失败，请稍后重试', 'warning')
      return
    }

    currentPlanType.value = body.data.planType ?? null
    planList.value = body.data.planList ?? []

    if (!planList.value.some((item) => String(item.id) === String(selectedPlanId.value))) {
      selectedPlanId.value = isNewUserPlanType.value
        ? promoPlan.value?.id ?? planList.value[0]?.id ?? null
        : planList.value[0]?.id ?? null
    }
  } catch (error: any) {
    showMessage(error?.message || '套餐加载失败，请稍后重试', 'warning')
  } finally {
    loading.value = false
  }
}

const selectPlan = (planId: PlanId) => {
  selectedPlanId.value = planId
}

const openPayMethodSheet = () => {
  if (!ensureLogin()) return
  if (!selectedPlanId.value) {
    showMessage('请先选择套餐', 'warning')
    return
  }
  payMethodOpen.value = true
}

const closePayMethodSheet = () => {
  payMethodOpen.value = false
}

const createPayQr = (url: string) => {
  return QRCode.toDataURL(url, {
    errorCorrectionLevel: 'M',
    margin: 2,
    width: 240,
    color: {
      dark: '#111827',
      light: '#ffffff'
    }
  })
}

const resetPayQr = () => {
  payQrOpen.value = false
  payQrUrl.value = ''
  payQrDataUrl.value = ''
  payQrOrderNo.value = ''
  currentPayType.value = ''
}

const closePayQr = () => {
  stopPolling()
  resetPayQr()
}

const openPayUrl = () => {
  if (!payQrUrl.value || typeof window === 'undefined') return
  window.open(payQrUrl.value, '_blank', 'noopener,noreferrer')
}

const submitOrder = async (payType: PayType) => {
  if (!ensureLogin()) return
  if (!selectedPlanId.value) return
  closePayMethodSheet()
  submitLoading.value = true
  stopPolling()
  resetPayQr()
  try {
    const body = await request<SubmitOrderResult>('POST', '/order/submit', {
      payType,
      planId: selectedPlanId.value
    })
    if (body?.code !== 200 || !body.data?.qrcode) {
      showMessage(body?.msg || '下单失败，请稍后重试', 'warning')
      return
    }
    currentPayType.value = payType
    payQrUrl.value = body.data.qrcode
    payQrOrderNo.value = body.data.orderNo ?? ''
    payQrDataUrl.value = await createPayQr(body.data.qrcode)
    payQrOpen.value = true
    if (body.data.orderNo) startPolling(body.data.orderNo)
  } catch (error: any) {
    showMessage(error?.message || '下单失败，请稍后重试', 'warning')
  } finally {
    submitLoading.value = false
  }
}

const startPolling = (orderNo: string) => {
  stopPolling()
  pollingOrderNo.value = orderNo
  pollAttempts.value = 0
  pollTimer = window.setTimeout(pollOrderStatus, POLL_INTERVAL_MS)
}

const stopPolling = () => {
  if (pollTimer != null) window.clearTimeout(pollTimer)
  pollTimer = null
  pollingOrderNo.value = ''
  pollAttempts.value = 0
}

const parsePaidValue = (value: any) => {
  if (value == null) return false
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value > 0
  if (typeof value === 'string') {
    return ['1', 'true', 'paid', 'success', 'succeeded'].includes(value.trim().toLowerCase())
  }
  return false
}

const isOrderPaid = (data: any) => {
  if (data == null) return false
  if (typeof data !== 'object') return parsePaidValue(data)
  return ['paid', 'isPay', 'payStatus', 'status', 'isPaid'].some((key) => parsePaidValue(data[key]))
}

const scheduleNextPoll = () => {
  if (!pollingOrderNo.value) return
  pollAttempts.value += 1
  if (pollAttempts.value >= MAX_POLL_ATTEMPTS) {
    stopPolling()
    showMessage('订单已创建，请在订单列表确认支付状态', 'info')
    return
  }
  pollTimer = window.setTimeout(pollOrderStatus, POLL_INTERVAL_MS)
}

const pollOrderStatus = async () => {
  if (!pollingOrderNo.value) return
  try {
    const body = await request<any>('GET', `/order/query/${pollingOrderNo.value}`)
    if (body?.code === 200 && isOrderPaid(body.data)) {
      stopPolling()
      resetPayQr()
      showMessage('支付成功', 'success')
      void loadPlanList()
      return
    }
  } catch {
    // Keep polling; temporary network errors should not close the payment dialog.
  }
  scheduleNextPoll()
}

const formatMoney = (value?: string | number | null) => {
  const num = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(num)) return '-'
  return Number.isInteger(num) ? String(num) : num.toFixed(1).replace(/\.0$/, '')
}

const formatDuration = (useDays?: number | null) => {
  if (!useDays || useDays <= 0) return '时长待定'
  if (useDays > 3650) return '可获取永久时长'
  return `可获取时长${useDays}天`
}

const formatPlanDescription = (plan: PlanInfo) => {
  const fallback = '高速 VPN 访问|不限流量使用|7x24 客服支持'
  return (plan.planDesc || fallback)
    .split('|')
    .map((item) => item.trim())
    .filter(
      (item) =>
        item &&
        !item.includes('新用户专享') &&
        !item.includes('按30天每月计算') &&
        !item.includes('有效期')
    )
    .join(' · ')
}

const formatPerMonth = (plan?: PlanInfo | null) => {
  if (!plan?.useDays) return '-'
  const amount = parseMoney(plan.finalMoney)
  const months = plan.useDays / 30
  if (!amount || months <= 0) return '-'
  const result = amount / months
  return Number.isInteger(result) ? String(result) : result.toFixed(1).replace(/\.0$/, '')
}

onMounted(() => {
  auth.initAuth()
  void loadPlanList()
})

onBeforeUnmount(() => {
  stopPolling()
})
</script>

<template>
  <div class="purchase-page">
    <div v-if="loading" class="purchase-empty">套餐加载中...</div>

    <template v-else>
      <div class="purchase-grid">
        <div
          v-if="promoPlan"
          class="promo-card"
          :class="{ active: isSelected(promoPlan) }"
          @click="selectPlan(promoPlan.id)"
        >
          <div class="card-head">
            <div class="promo-title">福利套餐</div>
            <div class="promo-price">¥{{ formatMoney(promoPlan.finalMoney) }}</div>
          </div>
          <div class="promo-content">
            <div class="promo-offer-box">
              <div class="promo-main">限时特惠，抓紧购买</div>
              <div class="promo-desc">买3个月送2个月,再打折!</div>
              <div class="promo-note-line">
                <span>新用户专享福利</span>
                <span class="promo-note-dot"></span>
                <span>限购一次</span>
              </div>
              <div class="promo-chip">是的，只需99元</div>
            </div>
            <div class="promo-chip secondary">获取时长5个月 ≈ ¥19.8/月</div>
          </div>
        </div>

        <div
          v-for="plan in normalPlans"
          :key="plan.id"
          class="plan-card"
          :class="{ active: isSelected(plan) }"
          @click="selectPlan(plan.id)"
        >
          <div class="card-head">
            <div class="plan-name">{{ plan.planName || '套餐' }}</div>
            <div class="plan-price">¥{{ formatMoney(plan.finalMoney) }}</div>
          </div>
          <div class="plan-desc">
            {{ formatPlanDescription(plan) }}
          </div>
          <div class="plan-meta">
            <span>{{ formatDuration(plan.useDays) }}</span>
            <span class="plan-meta-dot"></span>
            <span>约 ¥{{ formatPerMonth(plan) }}/月</span>
          </div>
        </div>

        <div
          v-if="lifetimePlan"
          class="lifetime-card"
          :class="{ active: isSelected(lifetimePlan) }"
          @click="selectPlan(lifetimePlan.id)"
        >
          <div class="lifetime-badge">永久会员</div>
          <div class="lifetime-price">¥{{ formatMoney(lifetimePlan.finalMoney) }}</div>
          <div class="lifetime-title">获取永久时长 · 黄鸟已稳定运行2514天</div>
          <div class="lifetime-desc">一次开通，永久使用</div>
          <div class="lifetime-chip lifetime-center">限时年卡 vs 永久会员</div>
          <div class="lifetime-desc lifetime-center">长期使用建议直接永久，一次决定后续省心</div>
          <div class="pk-compare">
            <div class="pk-box pk-left">
              <div class="pk-mini">限时年卡</div>
              <div class="pk-name">买年卡</div>
              <div class="pk-price-small">¥365</div>
              <div class="pk-text">一年先用，价格亲民，性价比高</div>
            </div>
            <div class="pk-center">PK</div>
            <div class="pk-box pk-right">
              <div class="pk-mini">永久</div>
              <div class="pk-name">买永久</div>
              <div class="pk-price-small">¥799</div>
              <div class="pk-text">用2年直接回本 即省1000多元</div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!planList.length" class="purchase-empty">暂无可用套餐</div>
    </template>

    <div class="purchase-footer">
      <button
        type="button"
        class="purchase-button primary buy-btn"
        :disabled="!selectedPlan || submitLoading"
        @click="openPayMethodSheet"
      >
        {{ buyButtonText }}
      </button>
    </div>

    <Teleport to="body">
      <Transition name="purchase-modal">
        <div
          v-if="payMethodOpen"
          class="purchase-modal-mask"
          role="dialog"
          aria-modal="true"
          @click.self="closePayMethodSheet"
        >
          <div class="purchase-modal method-modal">
            <button type="button" class="purchase-modal-close" aria-label="关闭" @click="closePayMethodSheet">
              ×
            </button>
            <div class="purchase-modal-title">选择支付方式</div>
            <div class="pay-methods">
              <div class="method-card" @click="submitOrder('alipay')">
                <div class="method-title">支付宝</div>
                <div class="method-subtitle">生成支付宝支付二维码，扫码后在手机端完成支付</div>
              </div>
              <div class="method-card" @click="submitOrder('wxpay')">
                <div class="method-title">微信支付</div>
                <div class="method-subtitle">生成微信支付二维码，扫码后成功会自动到账</div>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <Transition name="purchase-modal">
        <div
          v-if="payQrOpen"
          class="purchase-modal-mask"
          role="dialog"
          aria-modal="true"
          @click.self="closePayQr"
        >
          <div class="purchase-modal qr-modal">
            <button type="button" class="purchase-modal-close" aria-label="关闭" @click="closePayQr">
              ×
            </button>
            <div class="purchase-modal-title">{{ payQrTitle }}</div>
            <div class="pay-qr-panel">
              <div class="pay-qr-summary">
                <div class="pay-qr-plan">{{ selectedPlan?.planName || '已选套餐' }}</div>
                <div class="pay-qr-price">¥{{ formatMoney(selectedPlan?.finalMoney) }}</div>
              </div>

              <div class="pay-qr-box">
                <img v-if="payQrDataUrl" :src="payQrDataUrl" alt="支付二维码" />
                <div v-else class="pay-qr-loading">二维码生成中...</div>
              </div>

              <div class="pay-qr-tips">
                <div>请使用{{ currentPayMethodName }}扫码完成支付</div>
                <div>支付成功后会自动刷新到账状态</div>
              </div>

              <div v-if="payQrOrderNo" class="pay-qr-order">订单号：{{ payQrOrderNo }}</div>

              <div class="pay-qr-actions">
                <button type="button" class="purchase-button normal" @click="openPayUrl">打开支付链接</button>
                <button type="button" class="purchase-button primary" @click="closePayQr">关闭</button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <Message
      v-if="toast"
      :key="toast.key"
      :message="toast.message"
      :type="toast.type"
      @close="toast = null"
    />
  </div>
</template>

<style scoped>
.purchase-page {
  --app-pay-bg: #0b1220;
  --app-pay-text: #f8fafc;
  --app-pay-muted: #94a3b8;
  --app-pay-card-bg: #111827;
  --app-pay-card-color: #e5e7eb;
  display: flex;
  min-height: 100%;
  flex-direction: column;
  background: var(--app-pay-bg);
  color: var(--app-pay-text);
}

.purchase-empty {
  display: flex;
  min-height: 320px;
  align-items: center;
  justify-content: center;
  color: var(--app-pay-muted);
}

.purchase-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 18px;
  padding: 10px 50px 110px;
}

.promo-card,
.plan-card,
.lifetime-card,
.method-card {
  position: relative;
  cursor: pointer;
  border-radius: 22px;
  padding: 22px 24px;
  color: #fff;
  outline: 2px solid transparent;
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.22);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    outline-color 0.18s ease;
}

.promo-card:hover,
.plan-card:hover,
.lifetime-card:hover,
.method-card:hover {
  transform: translateY(-2px);
}

.promo-card.active,
.plan-card.active,
.lifetime-card.active {
  outline-color: #facc15;
  box-shadow: 0 24px 44px rgba(250, 204, 21, 0.16);
}

.promo-card {
  grid-column: 1 / -1;
  display: flex;
  min-height: 300px;
  flex-direction: column;
  justify-content: space-between;
  background:
    radial-gradient(circle at top right, rgba(255, 255, 255, 0.18), transparent 24%),
    linear-gradient(145deg, #7f1d1d 0%, #b91c1c 36%, #111827 100%);
}

.plan-card {
  background: linear-gradient(180deg, #102c57 0%, #0b1f3e 100%);
}

.lifetime-card {
  grid-column: 1 / -1;
  background:
    radial-gradient(circle at top right, rgba(255, 255, 255, 0.12), transparent 24%),
    linear-gradient(180deg, #831843 0%, #4c0519 100%);
}

.promo-chip,
.lifetime-badge,
.lifetime-chip {
  display: inline-flex;
  width: fit-content;
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 800;
}

.lifetime-price {
  position: absolute;
  top: 22px;
  right: 24px;
  margin-top: 0;
  color: #fde68a;
  font-size: 30px;
  font-weight: 900;
  line-height: 1;
}

.promo-price {
  flex: none;
  color: #fde68a;
  font-size: 30px;
  font-weight: 900;
  line-height: 1;
}

.card-head {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.plan-price {
  flex: none;
  color: #fde68a;
  font-size: 30px;
  font-weight: 900;
  line-height: 1;
}

.plan-name {
  min-width: 0;
}

.promo-title,
.plan-name {
  font-size: 22px;
  font-weight: 900;
  line-height: 1.25;
}

.lifetime-title {
  margin-top: 12px;
  font-size: 16px;
}

.promo-title {
  color: #fff;
  text-align: left;
}

.promo-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.promo-main {
  font-size: 22px;
  font-weight: 900;
}

.promo-offer-box {
  display: flex;
  width: min(520px, 100%);
  flex-direction: column;
  align-items: center;
  border: 2px dashed rgba(255, 255, 255, 0.45);
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.06);
  padding: 24px 28px;
}

.promo-desc,
.promo-note-line,
.plan-desc,
.lifetime-desc,
.method-subtitle {
  margin-top: 12px;
  color: rgba(255, 255, 255, 0.88);
  font-size: 13px;
  line-height: 1.7;
}

.plan-meta {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  gap: 9px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  padding: 6px 12px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  font-weight: 700;
  line-height: 1.35;
}

.plan-meta-dot {
  width: 4px;
  height: 4px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.65);
}

.promo-desc {
  text-align: center;
}

.promo-note-line {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-align: center;
}

.promo-note-dot {
  width: 5px;
  height: 5px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
}

.promo-chip,
.lifetime-chip {
  background: rgba(250, 204, 21, 0.14);
  color: #fef08a;
}

.promo-chip.secondary {
  display: inline-flex;
  align-items: center;
  margin-top: 6px;
  margin-left: 0;
  background: rgba(255, 255, 255, 0.1);
  color: #f8fafc;
}

.lifetime-badge {
  background: rgba(255, 255, 255, 0.14);
  color: #fde68a;
}

.lifetime-center {
  display: flex;
  justify-content: center;
  margin-right: auto;
  margin-left: auto;
  text-align: center;
}

.pk-compare {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: stretch;
  gap: 12px;
  margin-top: 18px;
}

.pk-box {
  min-height: 220px;
  border-radius: 18px;
  padding: 14px;
}

.pk-left {
  background: linear-gradient(180deg, #2389e8 0%, #2266d2 100%);
}

.pk-right {
  background: linear-gradient(180deg, #ff6280 0%, #f0455d 100%);
}

.pk-center {
  display: flex;
  width: 54px;
  height: 54px;
  align-self: center;
  justify-self: center;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: #111827;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.28);
  color: #fff;
  font-weight: 900;
  transform: rotate(-12deg);
}

.pk-mini {
  display: inline-flex;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 700;
}

.pk-name {
  margin-top: 18px;
  font-size: 28px;
  font-weight: 900;
}

.pk-price-small {
  margin-top: 12px;
  color: #fde68a;
  font-size: 32px;
  font-weight: 900;
}

.pk-text {
  margin-top: 16px;
  color: rgba(255, 255, 255, 0.94);
  font-size: 13px;
  line-height: 1.6;
}

.purchase-footer {
  position: sticky;
  bottom: 0;
  display: flex;
  justify-content: center;
  margin-top: auto;
  background: linear-gradient(180deg, rgba(11, 18, 32, 0) 0%, var(--app-pay-bg) 28%);
  padding: 10px 0 8px;
}

.purchase-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 6px;
  padding: 8px 14px;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.35;
  cursor: pointer;
  transition:
    background 0.18s ease,
    color 0.18s ease,
    opacity 0.18s ease,
    transform 0.18s ease;
}

.purchase-button:hover {
  transform: translateY(-1px);
}

.purchase-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
  transform: none;
}

.purchase-button.primary {
  background: #facc15;
  color: #111827;
}

.purchase-button.primary:hover:not(:disabled) {
  background: #fde047;
}

.purchase-button.normal {
  border: 1px solid rgba(148, 163, 184, 0.28);
  background: rgba(255, 255, 255, 0.08);
  color: var(--app-pay-text);
}

.purchase-button.normal:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.14);
}

.buy-btn {
  min-width: 260px;
}

.purchase-modal-mask {
  position: fixed;
  z-index: 999;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(2, 6, 23, 0.62);
  backdrop-filter: blur(4px);
}

.purchase-modal {
  position: relative;
  width: min(38rem, calc(100vw - 32px));
  max-height: min(86vh, 720px);
  overflow-y: auto;
  border-radius: 6px;
  background: #111827;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.36);
  padding: 18px 20px 20px;
  color: var(--app-pay-text);
}

.method-modal {
  width: min(42rem, calc(100vw - 32px));
}

.qr-modal {
  width: min(30rem, calc(100vw - 32px));
}

.purchase-modal-close {
  position: absolute;
  top: 12px;
  right: 14px;
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #cbd5e1;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
}

.purchase-modal-close:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}

.purchase-modal-title {
  margin-right: 36px;
  margin-bottom: 14px;
  font-size: 15px;
  font-weight: 800;
}

.pay-methods {
  display: grid;
  gap: 12px;
  padding: 8px 0;
}

.method-card {
  background: var(--app-pay-card-bg);
  color: var(--app-pay-card-color);
}

.method-title {
  font-size: 18px;
  font-weight: 800;
}

.pay-qr-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 4px 0 8px;
}

.pay-qr-summary {
  display: flex;
  width: min(236px, 100%);
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  color: var(--app-pay-text);
}

.pay-qr-plan {
  min-width: 0;
  overflow: hidden;
  font-size: 14px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pay-qr-price {
  flex: none;
  color: #f59e0b;
  font-size: 18px;
  font-weight: 900;
}

.pay-qr-box {
  width: 224px;
  height: 224px;
  border: 1px solid rgba(148, 163, 184, 0.36);
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.14);
  padding: 10px;
}

.pay-qr-box img,
.pay-qr-loading {
  width: 100%;
  height: 100%;
}

.pay-qr-box img {
  display: block;
}

.pay-qr-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 13px;
}

.pay-qr-tips {
  color: var(--app-pay-muted);
  font-size: 12px;
  line-height: 1.55;
  text-align: center;
}

.pay-qr-order {
  max-width: 100%;
  border-radius: 6px;
  background: var(--app-pay-card-bg);
  padding: 5px 9px;
  color: var(--app-pay-muted);
  font-size: 12px;
  word-break: break-all;
}

.pay-qr-actions {
  display: flex;
  justify-content: center;
  gap: 6px;
}

.purchase-modal-enter-active,
.purchase-modal-leave-active {
  transition: opacity 0.2s ease;
}

.purchase-modal-enter-active .purchase-modal,
.purchase-modal-leave-active .purchase-modal {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.purchase-modal-enter-from,
.purchase-modal-leave-to {
  opacity: 0;
}

.purchase-modal-enter-from .purchase-modal,
.purchase-modal-leave-to .purchase-modal {
  opacity: 0;
  transform: scale(0.96);
}

@media (max-width: 900px) {
  .purchase-grid {
    grid-template-columns: 1fr;
    padding-right: 18px;
    padding-left: 18px;
  }

  .pk-compare {
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  }

  .pk-center {
    margin: 0;
  }
}

@media (max-width: 640px) {
  .purchase-grid {
    padding-right: 12px;
    padding-left: 12px;
  }

  .promo-card,
  .plan-card,
  .lifetime-card {
    padding: 18px;
  }

  .card-head {
    align-items: flex-start;
  }

  .promo-price,
  .plan-price,
  .lifetime-price {
    font-size: 24px;
  }

  .lifetime-price {
    position: static;
    margin-top: 10px;
  }

  .pk-compare {
    gap: 8px;
  }

  .pk-box {
    min-height: 180px;
    padding: 12px;
  }

  .pk-center {
    width: 42px;
    height: 42px;
    font-size: 13px;
  }

  .pk-name {
    font-size: 22px;
  }

  .pk-price-small {
    font-size: 26px;
  }
}
</style>
