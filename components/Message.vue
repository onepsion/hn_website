<template>
  <transition name="fade" appear>
    <div
      v-if="visible"
      class="fixed bottom-5 right-5 w-72 flex items-center gap-2 px-4 py-3 rounded-lg shadow-md border z-50"
      :class="typeClasses[currentType]"
    >
      <span>{{ icons[currentType] }}</span>
      <span class="flex-1">{{ message }}</span>
      <button @click="close" class="ml-2 text-gray-500 hover:text-gray-700">✖</button>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue"

type MessageType = "success" | "error" | "warning" | "info"

interface Props {
  message: string
  type?: MessageType
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: "info",
  duration: 3000
})

const emit = defineEmits(["close"])
const visible = ref(true)

const currentType = computed<MessageType>(() => props.type ?? "info")

const typeClasses: Record<MessageType, string> = {
  success: "bg-green-100 text-green-800 border-green-300",
  error: "bg-red-100 text-red-800 border-red-300",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
  info: "bg-blue-100 text-blue-800 border-blue-300"
}

const icons: Record<MessageType, string> = {
  success: "✅",
  error: "❌",
  warning: "⚠️",
  info: "ℹ️"
}

function close() {
  visible.value = false
  emit("close")
}

onMounted(() => {
  if (props.duration !== 0) {
    setTimeout(close, props.duration)
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
