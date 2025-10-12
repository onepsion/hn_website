// stores/auth.ts
import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', {
  state: () => ({
    dark: true
  }),
  getters: {
    isDark: (state) => !!state.dark
  },
  actions: {

    changeDark() {
      this.dark = !this.dark
    },

    setDark() {
      this.dark = true
    }
  }
})
