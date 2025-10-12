<template>
  <!-- 只在 visible 时渲染 Teleport 的内容 -->
  <Teleport to="body" v-if="visibleLocal">
    <!-- 背景遮罩 + 过渡 -->
    <Transition name="modal-fade">
      <div
        class="fixed inset-0 z-40 flex items-center justify-center"
        aria-modal="true"
        role="dialog"
      >
        <!-- 背景遮罩 -->
        <div
          class="fixed inset-0 bg-black/50 backdrop-blur-sm"
          @click="onRequestClose"
        ></div>

        <!-- 弹窗容器 -->
        <Transition name="modal-scale">
          <div
            class="relative z-50 max-w-lg w-full mx-4 bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6"
            @click.stop
          >
            <!-- 头部：标题 + 关闭按钮 -->
            <header class="flex items-start justify-between gap-4 mb-4">
              <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">
                <slot name="title">{{ title }}</slot>
              </h3>
              <button
                type="button"
                class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                @click="onRequestClose"
                aria-label="关闭"
              >
                <!-- 简单的 X 图标（svg） -->
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 8.586L4.293 2.879A1 1 0 102.879 4.293L8.586 10l-5.707 5.707a1 1 0 101.414 1.414L10 11.414l5.707 5.707a1 1 0 101.414-1.414L11.414 10l5.707-5.707a1 1 0 10-1.414-1.414L10 8.586z" clip-rule="evenodd" />
                </svg>
              </button>
            </header>

            <!-- 内容插槽 -->
            <div class="text-slate-700 dark:text-slate-300">
              <slot>
                这是弹窗内容。你可以传内容到默认插槽。
              </slot>
            </div>

            <!-- 可选：底部操作按钮 -->
            <footer class="mt-6 flex justify-end gap-3">
              <slot name="footer">
                <button
                  class="px-4 py-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700"
                  @click="onRequestClose"
                >
                  关闭
                </button>
              </slot>
            </footer>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '提示' },
  closeOnEsc: { type: Boolean, default: true },
  closeOnOutsideClick: { type: Boolean, default: true }
})

const emit = defineEmits(['update:modelValue', 'close'])

/**
 * 使用可控的本地 visible（便于过渡与 Teleport 控制）
 * visibleLocal 用于实际是否渲染 Teleport 的内容
 */
const visibleLocal = ref(props.modelValue)

watch(
  () => props.modelValue,
  (v) => {
    visibleLocal.value = v
  }
)

// 当请求关闭时，emit 更新 modelValue=false 并触发 close 事件
function onRequestClose() {
  emit('update:modelValue', false)
  emit('close')
}

// 处理 ESC 关闭
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.closeOnEsc) {
    onRequestClose()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped>
/* 过渡：背景淡入淡出 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 200ms ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-to,
.modal-fade-leave-from {
  opacity: 1;
}

/* 过渡：弹窗缩放 */
.modal-scale-enter-active {
  transition: transform 200ms cubic-bezier(.2,.8,.2,1), opacity 200ms;
}
.modal-scale-leave-active {
  transition: transform 150ms cubic-bezier(.4,0,.2,1), opacity 150ms;
}
.modal-scale-enter-from {
  transform: translateY(8px) scale(.98);
  opacity: 0;
}
.modal-scale-enter-to {
  transform: translateY(0) scale(1);
  opacity: 1;
}
.modal-scale-leave-from {
  transform: translateY(0) scale(1);
  opacity: 1;
}
.modal-scale-leave-to {
  transform: translateY(8px) scale(.98);
  opacity: 0;
}
</style>
