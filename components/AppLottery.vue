<template>
  <section class="lottery-wrap">
    <div class="lottery-panel">
      <div class="lottery-header">
        <div>
          <p class="lottery-eyebrow">抽奖领券</p>
          <h1 class="lottery-title">{{ activityTitle }}</h1>
        </div>
        <button class="lottery-refresh" type="button" :disabled="loading" @click="loadActivity">
          {{ loading ? '加载中' : '刷新' }}
        </button>
      </div>

      <div class="lottery-meta">
        <div>
          <span>消耗</span>
          <strong>{{ costText }}</strong>
        </div>
        <div>
          <span>次数</span>
          <strong>{{ limitText }}</strong>
        </div>
        <div>
          <span>时间</span>
          <strong>{{ timeText }}</strong>
        </div>
      </div>

      <div class="lottery-content">
        <div class="lottery-board">
          <ClientOnly>
            <LuckyGrid
              ref="luckyGrid"
              :width="gridLength"
              :height="gridLength"
              :rows="3"
              :cols="3"
              :blocks="gridBlocks"
              :prizes="gridPrizes"
              :button="gridButton"
              :default-config="gridConfig"
              :default-style="gridStyle"
              :active-style="gridActiveStyle"
              @start="handleStart"
              @end="handleEnd"
            />
            <template #fallback>
              <div class="lottery-board-fallback">抽奖加载中</div>
            </template>
          </ClientOnly>
        </div>

        <aside class="lottery-side">
          <div class="lottery-status" :class="{ 'lottery-status-disabled': !activityAvailable }">
            <span>{{ activityStatusText }}</span>
            <strong>{{ drawButtonText }}</strong>
          </div>

          <div class="lottery-prize-list">
            <div v-for="item in displayPrizes" :key="String(item.id)" class="lottery-prize-chip">
              <span>{{ getPrizeTag(item) }}</span>
              <strong>{{ item.prizeName }}</strong>
            </div>
          </div>
        </aside>
      </div>
    </div>

    <transition name="lottery-dialog">
      <div v-if="resultDialogOpen" class="lottery-dialog-mask" @click.self="closeResult">
        <div class="lottery-dialog">
          <p class="lottery-dialog-eyebrow">{{ resultIsCoupon ? '恭喜获得' : '抽奖结果' }}</p>
          <h2>{{ resultTitle }}</h2>
          <p>{{ resultDescription }}</p>
          <div class="lottery-dialog-actions">
            <button v-if="resultIsCoupon" class="lottery-primary-btn" type="button" @click="goUseCoupon">
              去使用
            </button>
            <button class="lottery-secondary-btn" type="button" @click="closeResult">
              知道了
            </button>
          </div>
        </div>
      </div>
    </transition>

    <Message
      v-if="toast"
      :key="toast.key"
      :message="toast.message"
      :type="toast.type"
      @close="toast = null"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { drawLottery, getLotteryActivity } from '~/utils/service'

type ApiResponse<T> = {
  code: number
  msg?: string
  data?: T
}

type LotteryActivity = {
  id?: string | number
  name?: string
  drawCostType?: string
  drawCostValue?: string | number
  dailyLimit?: string | number
  totalLimit?: string | number
  startTime?: string
  endTime?: string
  status?: string | number
  description?: string
}

type LotteryPrize = {
  id?: string | number
  prizeName?: string
  prizeType?: string
  couponTemplateId?: string | number
  stock?: string | number | null
  sort?: string | number
}

type DisplayPrize = Required<Pick<LotteryPrize, 'id' | 'prizeName' | 'prizeType'>> & {
  x: number
  y: number
  stock?: string | number | null
}

type LotteryPayload = {
  activity?: LotteryActivity
  prizes?: LotteryPrize[]
}

type LotteryResult = {
  activityId?: string | number
  recordId?: string | number
  prizeId?: string | number
  prizeName?: string
  prizeType?: string
  userCouponId?: string | number
}

type ToastType = 'success' | 'error' | 'warning' | 'info'

const LuckyGrid = defineAsyncComponent(async () => {
  const mod = await import('@lucky-canvas/vue')
  return mod.LuckyGrid
})

const DEFAULT_ACTIVITY_ID = 10001
const GRID_POSITIONS = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 2, y: 0 },
  { x: 2, y: 1 },
  { x: 2, y: 2 },
  { x: 1, y: 2 },
  { x: 0, y: 2 },
  { x: 0, y: 1 }
]

const props = defineProps<{
  activityId?: string | number
}>()

const route = useRoute()
const router = useRouter()

const activity = ref<LotteryActivity | null>(null)
const prizes = ref<LotteryPrize[]>([])
const loading = ref(false)
const drawing = ref(false)
const gridSize = ref(340)
const luckyGrid = ref<{ play: () => void; stop: (index?: number) => void } | null>(null)
const pendingResult = ref<LotteryResult | null>(null)
const lastResult = ref<LotteryResult | null>(null)
const resultDialogOpen = ref(false)
const toast = ref<{ key: number; type: ToastType; message: string } | null>(null)

let toastKey = 0
let stopTimer: number | null = null

const routeActivityId = computed(() => {
  const queryId = route.query.activityId ?? route.query.activity_id
  const value = props.activityId ?? (Array.isArray(queryId) ? queryId[0] : queryId)
  return value || DEFAULT_ACTIVITY_ID
})

const gridLength = computed(() => `${gridSize.value}px`)

const activityTitle = computed(() => activity.value?.name || '每日抽奖')

const activityAvailable = computed(() => {
  if (!activity.value) return false
  if (Number(activity.value.status ?? 0) !== 0) return false

  const now = Date.now()
  const start = parseDateTime(activity.value.startTime)
  const end = parseDateTime(activity.value.endTime)
  if (start && now < start) return false
  if (end && now > end) return false
  return true
})

const activityStatusText = computed(() => {
  if (loading.value) return '正在加载'
  if (!activity.value) return '活动未配置'
  if (Number(activity.value.status ?? 0) !== 0) return '活动已关闭'

  const now = Date.now()
  const start = parseDateTime(activity.value.startTime)
  const end = parseDateTime(activity.value.endTime)
  if (start && now < start) return '活动未开始'
  if (end && now > end) return '活动已结束'
  return '活动进行中'
})

const costText = computed(() => {
  const costType = activity.value?.drawCostType
  const value = Number(activity.value?.drawCostValue ?? 0)
  if (costType === 'point' && value > 0) return `${value} 积分/次`
  if (costType === 'task') return '任务次数'
  return '免费'
})

const limitText = computed(() => {
  const dailyLimit = Number(activity.value?.dailyLimit ?? 0)
  const totalLimit = Number(activity.value?.totalLimit ?? 0)
  const daily = dailyLimit > 0 ? `每日 ${dailyLimit} 次` : '每日不限'
  const total = totalLimit > 0 ? `总 ${totalLimit} 次` : ''
  return total ? `${daily} / ${total}` : daily
})

const timeText = computed(() => {
  const start = formatDate(activity.value?.startTime)
  const end = formatDate(activity.value?.endTime)
  if (start === '-' && end === '-') return '长期'
  return `${start} - ${end}`
})

const drawButtonText = computed(() => {
  if (drawing.value) return '开奖中'
  if (!activityAvailable.value) return '暂不可抽'
  return '立即抽奖'
})

const displayPrizes = computed<DisplayPrize[]>(() => {
  const normalized = [...prizes.value]
    .sort((a, b) => Number(a.sort ?? 0) - Number(b.sort ?? 0))
    .slice(0, GRID_POSITIONS.length)
    .map((item, index) => normalizePrize(item, index))

  while (normalized.length < GRID_POSITIONS.length) {
    normalized.push(normalizePrize({
      id: `none-${normalized.length}`,
      prizeName: '谢谢参与',
      prizeType: 'none',
      sort: normalized.length
    }, normalized.length))
  }

  return normalized
})

const gridBlocks = computed(() => [
  { padding: '10px', background: '#f0b429', borderRadius: '24px' },
  { padding: '8px', background: '#fff4cf', borderRadius: '18px' }
])

const gridConfig = {
  gutter: 8,
  speed: 18,
  accelerationTime: 900,
  decelerationTime: 2200
}

const gridStyle = {
  background: '#ffffff',
  borderRadius: '16px',
  fontColor: '#172335',
  fontSize: '14px',
  fontWeight: '700',
  lineHeight: '18px',
  wordWrap: true,
  lengthLimit: '72%',
  lineClamp: 2
}

const gridActiveStyle = {
  background: '#17385f',
  fontColor: '#ffffff',
  shadow: '0 0 18px rgba(23, 56, 95, 0.42)'
}

const gridPrizes = computed(() => displayPrizes.value.map((item) => ({
  x: item.x,
  y: item.y,
  background: getPrizeBackground(item),
  borderRadius: '16px',
  fonts: [
    {
      text: item.prizeName,
      top: '25%',
      fontSize: '15px',
      fontColor: '#172335',
      fontWeight: '700',
      wordWrap: true,
      lengthLimit: '76%',
      lineClamp: 2
    },
    {
      text: getPrizeTag(item),
      top: '63%',
      fontSize: '12px',
      fontColor: '#8a5b0a',
      fontWeight: '600'
    }
  ]
})))

const gridButton = computed(() => ({
  x: 1,
  y: 1,
  background: activityAvailable.value ? '#172335' : '#475569',
  borderRadius: '18px',
  shadow: activityAvailable.value ? '0 14px 28px rgba(23, 35, 53, 0.24)' : '',
  fonts: [
    {
      text: drawButtonText.value,
      top: '32%',
      fontSize: '18px',
      fontColor: '#ffffff',
      fontWeight: '800'
    },
    {
      text: costText.value,
      top: '59%',
      fontSize: '11px',
      fontColor: '#f6c54a',
      fontWeight: '700'
    }
  ]
}))

const resultIsCoupon = computed(() => lastResult.value?.prizeType === 'coupon' && !!lastResult.value?.userCouponId)
const resultTitle = computed(() => lastResult.value?.prizeName || '谢谢参与')
const resultDescription = computed(() => {
  if (resultIsCoupon.value) return '优惠券已放入账户，下单时可以直接选择使用'
  return '本次没有获得优惠券'
})

onMounted(() => {
  updateGridSize()
  window.addEventListener('resize', updateGridSize)
  void loadActivity()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateGridSize)
  if (stopTimer != null) window.clearTimeout(stopTimer)
})

function updateGridSize() {
  const width = window.innerWidth
  gridSize.value = Math.min(Math.max(width - 32, 288), 380)
}

async function loadActivity() {
  loading.value = true
  try {
    const res = await getLotteryActivity(routeActivityId.value) as ApiResponse<LotteryPayload>
    if (res?.code !== 200 || !res.data?.activity) {
      showMessage(res?.msg || '抽奖活动加载失败', 'warning')
      return
    }

    activity.value = res.data.activity
    prizes.value = Array.isArray(res.data.prizes) ? res.data.prizes : []
  } catch (error: any) {
    showMessage(error?.message || '抽奖活动加载失败', 'warning')
  } finally {
    loading.value = false
  }
}

async function handleStart() {
  if (drawing.value) return
  if (!activityAvailable.value) {
    showMessage(activityStatusText.value, 'warning')
    return
  }

  drawing.value = true
  pendingResult.value = null
  luckyGrid.value?.play()
  const minStopAt = Date.now() + 900

  try {
    const res = await drawLottery(routeActivityId.value) as ApiResponse<LotteryResult>
    if (res?.code !== 200 || !res.data) {
      throw new Error(res?.msg || '抽奖失败，请稍后重试')
    }

    pendingResult.value = res.data
    stopGridAtResult(res.data, minStopAt)
  } catch (error: any) {
    pendingResult.value = {
      prizeId: findNonePrize()?.id,
      prizeName: '谢谢参与',
      prizeType: 'none'
    }
    showMessage(error?.message || '抽奖失败，请稍后重试', 'warning')
    stopGridAtResult(pendingResult.value, minStopAt)
  }
}

function stopGridAtResult(result: LotteryResult, minStopAt: number) {
  const prizeIndex = findPrizeIndex(result.prizeId)
  const delay = Math.max(0, minStopAt - Date.now())

  if (stopTimer != null) window.clearTimeout(stopTimer)
  stopTimer = window.setTimeout(() => {
    luckyGrid.value?.stop(prizeIndex)
  }, delay)
}

function handleEnd() {
  drawing.value = false
  lastResult.value = pendingResult.value
  pendingResult.value = null
  resultDialogOpen.value = true
  void loadActivity()
}

function findPrizeIndex(prizeId?: string | number) {
  if (prizeId == null) return Math.max(0, displayPrizes.value.findIndex((item) => item.prizeType === 'none'))
  const index = displayPrizes.value.findIndex((item) => String(item.id) === String(prizeId))
  return index >= 0 ? index : 0
}

function findNonePrize() {
  return displayPrizes.value.find((item) => item.prizeType === 'none') || displayPrizes.value[0]
}

function normalizePrize(item: LotteryPrize, index: number): DisplayPrize {
  const position = GRID_POSITIONS[index]
  return {
    id: item.id ?? `none-${index}`,
    prizeName: item.prizeName || (item.prizeType === 'none' ? '谢谢参与' : '优惠券'),
    prizeType: item.prizeType || 'coupon',
    stock: item.stock,
    x: position.x,
    y: position.y
  }
}

function getPrizeTag(item: Pick<LotteryPrize, 'prizeType' | 'stock'>) {
  if (item.prizeType === 'coupon') return '优惠券'
  if (item.prizeType === 'none') return '再接再厉'
  return '奖品'
}

function getPrizeBackground(item: Pick<LotteryPrize, 'prizeType'>) {
  if (item.prizeType === 'none') return '#eef2f7'
  return '#fffaf0'
}

function parseDateTime(value?: string) {
  if (!value) return 0
  const parsed = Date.parse(value.replace(/-/g, '/'))
  return Number.isFinite(parsed) ? parsed : 0
}

function formatDate(value?: string) {
  const time = parseDateTime(value)
  if (!time) return '-'
  return new Date(time).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

function showMessage(message: string, type: ToastType = 'info') {
  toast.value = { key: ++toastKey, type, message }
}

function closeResult() {
  resultDialogOpen.value = false
}

function goUseCoupon() {
  resultDialogOpen.value = false
  void router.push('/profile/pay')
}
</script>

<style scoped>
.lottery-wrap {
  width: 100%;
}

.lottery-panel {
  width: min(100%, 980px);
  margin: 0 auto;
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 20px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.94), rgba(255, 249, 235, 0.9)),
    #ffffff;
  box-shadow: 0 22px 54px rgba(15, 23, 42, 0.14);
  padding: 20px;
}

.dark .lottery-panel {
  background:
    linear-gradient(135deg, rgba(23, 35, 53, 0.96), rgba(30, 41, 59, 0.94)),
    #172335;
  border-color: rgba(148, 163, 184, 0.16);
}

.lottery-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.lottery-eyebrow {
  margin: 0 0 6px;
  font-size: 13px;
  font-weight: 800;
  color: #d99609;
}

.lottery-title {
  margin: 0;
  font-size: clamp(24px, 4vw, 36px);
  line-height: 1.18;
  font-weight: 900;
  color: #172335;
  letter-spacing: 0;
}

.dark .lottery-title {
  color: #f8fafc;
}

.lottery-refresh {
  min-width: 72px;
  border: 1px solid rgba(217, 150, 9, 0.35);
  border-radius: 12px;
  background: #fff7dd;
  color: #8a5b0a;
  font-weight: 800;
  padding: 10px 14px;
}

.lottery-refresh:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.lottery-meta {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin: 18px 0 20px;
}

.lottery-meta > div {
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.72);
  padding: 12px;
}

.dark .lottery-meta > div {
  background: rgba(15, 23, 42, 0.34);
}

.lottery-meta span {
  display: block;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 5px;
}

.lottery-meta strong {
  display: block;
  color: #172335;
  font-size: 14px;
  line-height: 1.35;
}

.dark .lottery-meta strong {
  color: #f8fafc;
}

.lottery-content {
  display: grid;
  grid-template-columns: minmax(288px, 420px) 1fr;
  gap: 22px;
  align-items: center;
}

.lottery-board {
  display: flex;
  align-items: center;
  justify-content: center;
}

.lottery-board-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  width: min(100%, 340px);
  aspect-ratio: 1;
  border-radius: 24px;
  background: #fff4cf;
  color: #8a5b0a;
  font-weight: 800;
}

.lottery-side {
  min-width: 0;
}

.lottery-status {
  border-radius: 16px;
  background: #17385f;
  color: #ffffff;
  padding: 18px;
  margin-bottom: 14px;
}

.lottery-status-disabled {
  background: #475569;
}

.lottery-status span,
.lottery-status strong {
  display: block;
}

.lottery-status span {
  font-size: 13px;
  opacity: 0.78;
  margin-bottom: 6px;
}

.lottery-status strong {
  font-size: 24px;
  line-height: 1.1;
}

.lottery-prize-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.lottery-prize-chip {
  min-height: 70px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.68);
  padding: 12px;
}

.dark .lottery-prize-chip {
  background: rgba(15, 23, 42, 0.32);
}

.lottery-prize-chip span {
  display: block;
  margin-bottom: 5px;
  color: #d99609;
  font-size: 12px;
  font-weight: 800;
}

.lottery-prize-chip strong {
  display: block;
  color: #172335;
  font-size: 14px;
  line-height: 1.35;
}

.dark .lottery-prize-chip strong {
  color: #f8fafc;
}

.lottery-dialog-mask {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(15, 23, 42, 0.58);
}

.lottery-dialog {
  width: min(100%, 380px);
  border-radius: 20px;
  background: #ffffff;
  color: #172335;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.32);
  padding: 24px;
  text-align: center;
}

.lottery-dialog-eyebrow {
  margin: 0 0 8px;
  color: #d99609;
  font-size: 13px;
  font-weight: 900;
}

.lottery-dialog h2 {
  margin: 0;
  font-size: 28px;
  line-height: 1.18;
  font-weight: 900;
}

.lottery-dialog p {
  margin: 12px 0 0;
  color: #64748b;
  line-height: 1.7;
}

.lottery-dialog-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 22px;
}

.lottery-primary-btn,
.lottery-secondary-btn {
  border-radius: 12px;
  padding: 11px 16px;
  font-weight: 800;
}

.lottery-primary-btn {
  background: #f0b429;
  color: #172335;
}

.lottery-secondary-btn {
  border: 1px solid rgba(148, 163, 184, 0.32);
  background: #ffffff;
  color: #172335;
}

.lottery-dialog-enter-active,
.lottery-dialog-leave-active {
  transition: opacity 180ms ease;
}

.lottery-dialog-enter-from,
.lottery-dialog-leave-to {
  opacity: 0;
}

@media (max-width: 820px) {
  .lottery-panel {
    border-radius: 0;
    padding: 16px;
  }

  .lottery-header {
    align-items: flex-start;
  }

  .lottery-meta {
    grid-template-columns: 1fr;
  }

  .lottery-content {
    grid-template-columns: 1fr;
  }

  .lottery-prize-list {
    grid-template-columns: 1fr;
  }
}
</style>
