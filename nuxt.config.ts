// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,            // SPA 模式
  app: {
    baseURL: '/'          // 路由 base
  },
  generate: {
    exclude: [
      '/en/blogs',
      '/zh/blogs',
      '/en/blog',
      '/zh/blog',
      '/zh/bloglist',
      '/en/bloglist',
      /blogs/, 
      /bloglist/,  
      /blog/, 
    ]
  },
  runtimeConfig: {
    public: {
      //apiBase: '/prod-api' 
      apiBase: 'http://192.168.0.106:8202' 
      //apiBase: 'https://panel.dsahn66.info/prod-api'
    }
  },
  devServer: {
    host: '0.0.0.0',
    port: 3000
  },
  modules: ['@nuxtjs/i18n', '@nuxtjs/tailwindcss','@pinia/nuxt','@nuxtjs/color-mode'],
   // @ts-expect-error Nuxt Image module config
  colorMode: {
    classSuffix: '', // dark 模式直接使用 'dark' 类，不加 '-mode'
    preference: 'system', // 默认跟随系统
    fallback: 'dark', // 当 localStorage 没有值时默认 light,
    storageKey: 'nuxt-color-mode'
  },
  // @ts-expect-error Nuxt Image module config
  // image: {
  //   provider: 'static', // 关键：不要走 ipx
  //   dir: 'public'
  // },
  tailwindcss: {
    // cssPath: ['~/assets/css/tailwind.css', { injectPosition: 0 }],
    configPath: 'tailwind.config.ts',
    exposeConfig: false,
    config: {},
    viewer: true,
  },
  plugins: ['~/plugins/wow.client.ts', '~/plugins/swiper.client.ts'],
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  i18n: {
    locales: [
      { code: 'zh', language: 'zh-CN', file: 'zh.json', name: '中文' },
      // { code: 'de', language: 'de-DE', file: 'de.json', name: 'Deutsch' },
      { code: 'en', language: 'en-US', file: 'en.json', name: 'English' },
      // { code: 'fr', language: 'fr-FR', file: 'fr.json', name: 'Français' },
      // { code: 'it', language: 'it-IT', file: 'it.json', name: 'Italiano' }
    ],
    defaultLocale: 'zh',
    strategy: 'prefix_and_default',
    langDir: 'locales/',
    vueI18n: './i18n.config.ts',
    customRoutes: 'config',
    pages: {
    },
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  }
  
})
