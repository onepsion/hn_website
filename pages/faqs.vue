<script setup lang="ts">
useHead({
  title: 'Blog Grids | Play Tailwind',
  meta: [
    { name: 'description', content: '' }
  ],
})

const localePath = useLocalePath()
import { reactive } from 'vue'

const faqs = reactive([
  {
    question: 'What is your refund policy?',
    answer: 'We offer a 30-day no-questions-asked money-back guarantee.',
    open: false,
  },
  {
    question: 'Do you offer team discounts?',
    answer: 'Yes! Contact us for custom team pricing depending on your needs.',
    open: false,
  },
  {
    question: 'How can I contact support?',
    answer: 'You can reach our support team via email or the live chat on our website.',
    open: false,
  },
])

function toggle(index) {
  faqs[index].open = !faqs[index].open
}
</script>

<template>
  <!-- ====== Banner Section Start -->
   <div class="bg-white/80 dark:bg-gray-900/90">
      <div class="p-5 relative z-10 overflow-hidden max-w-7xl mx-auto w-auto">
        <!-- <div
          class="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-stroke/0 via-stroke dark:via-dark-3 to-stroke/0">
        </div> -->
        <div class="mx-auto w-auto p-4">
          <div class="flex flex-wrap items-center -mx-4">
            <div class="w-full px-4">
              <div class="text-center">
                <ul class="flex items-center justify-left gap-[10px]">
                  <li>
                    <NuxtLink to="/"
                      class="flex items-center gap-[10px] text-base font-medium text-gray-900 dark:text-white">
                      Home
                    </NuxtLink>
                  </li>
                  <li>
                    <a href="javascript:void(0)" class="flex items-center gap-[10px] text-base font-medium text-gray-900 dark:text-white">
                      <span class="text-gray-900 dark:text-white"> / </span>
                      FAQS
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
  <!-- ====== Banner Section End -->

<!-- ====== Pricing Section Start -->
    <div class="bg-gray-100/50 dark:bg-gray-900/90">

      <div class="mx-auto px-8 py-12 max-w-7xl w-auto">
        <!-- 标题 -->
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">FAQs</h2>

        <!-- FAQ 列表 -->
        <div class="divide-y divide-gray-300 dark:divide-gray-700 border-t border-b">
          <div
            v-for="(faq, index) in faqs"
            :key="index"
            class="py-4 cursor-pointer select-none"
            @click="toggle(index)"
          >
            <div class="flex justify-between items-center">
              <span class="text-lg font-medium text-gray-900 dark:text-white">{{ faq.question }}</span>
              <span
                class="text-2xl font-bold text-yellow-500 transition-transform duration-300"
                :class="{ 'rotate-45': faq.open }"
              >
                +
              </span>
            </div>
            <div v-show="faq.open" class="mt-3 text-gray-900 dark:text-white text-base leading-relaxed transition">
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>

    </div>

    
</template>

<style>

</style>