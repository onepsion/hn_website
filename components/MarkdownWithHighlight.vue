<template>
  <div class="prose prose-slate max-w-none dark:prose-invert text-gray-900 dark:text-white">
    <Markdown :source="source" :md="mdParser" />
  </div>
</template>

<script setup>
import Markdown from 'vue3-markdown-it'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css' // 你也可以换成 monokai.css 等其他主题

defineProps({
  source: {
    type: String,
    required: true,
  }
})

// 自定义 Markdown 渲染器，支持代码块高亮
const mdParser = new MarkdownIt({
  highlight(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(code, { language: lang }).value}</code></pre>`
      } catch (_) {}
    }
    return `<pre class="hljs"><code>${MarkdownIt().utils.escapeHtml(code)}</code></pre>`
  }
})
</script>

<style scoped>
/* .hljs {
  padding: 1rem;
  border-radius: 0.375rem;
  background-color: #f3f4f6;
  overflow-x: auto;
  font-size: 0.875rem;
} */




</style>
