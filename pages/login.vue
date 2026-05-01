<template>
  <div class="overflow-hidden">
    <section class="site-shell min-h-[calc(100vh-120px)] px-4 pb-16 pt-20 sm:pt-24">
      <div class="mx-auto w-full max-w-md">
        <div class="glass-panel rounded-[32px] p-5 sm:p-6">
          <div class="rounded-2xl bg-slate-100/80 p-2 dark:bg-white/5">
            <div class="grid grid-cols-2 gap-2">
              <button
                type="button"
                class="rounded-xl px-4 py-3 text-base font-semibold transition"
                :class="activeTab === 'login'
                  ? 'bg-yellow-500 text-white shadow-md'
                  : 'text-[color:var(--site-muted)] hover:bg-white/80 dark:hover:bg-white/10'"
                @click="activeTab = 'login'"
              >
                登录
              </button>
              <button
                type="button"
                class="rounded-xl px-4 py-3 text-base font-semibold transition"
                :class="activeTab === 'register'
                  ? 'bg-yellow-500 text-white shadow-md'
                  : 'text-[color:var(--site-muted)] hover:bg-white/80 dark:hover:bg-white/10'"
                @click="activeTab = 'register'"
              >
                注册
              </button>
            </div>
          </div>

          <form v-if="activeTab === 'login'" class="mt-8 space-y-6" @submit.prevent="handleLogin">
            <div>
              <label class="mb-1 block text-sm text-[color:var(--site-text)]">用户名</label>
              <div class="flex items-center rounded-lg border border-[color:var(--site-line)] bg-white/85 px-3 dark:bg-white/5">
                <span class="mr-2 text-[color:var(--site-muted)]">👤</span>
                <input
                  v-model="loginForm.username"
                  type="text"
                  placeholder="请输入邮箱或者手机号"
                  class="flex-1 bg-transparent py-3 outline-none text-[color:var(--site-text)] placeholder:text-[color:var(--site-muted)]"
                />
              </div>

              <p v-if="loginFormValid.usernameError" class="mt-1 text-sm text-red-500">
                {{ loginFormValid.usernameError }}
              </p>
            </div>

            <div>
              <label class="mb-1 block text-sm text-[color:var(--site-text)]">密码</label>
              <div class="flex items-center rounded-lg border border-[color:var(--site-line)] bg-white/85 px-3 dark:bg-white/5">
                <span class="mr-2 text-[color:var(--site-muted)]">🔒</span>
                <input
                  v-model="loginForm.password"
                  type="password"
                  placeholder="请输入密码"
                  class="flex-1 bg-transparent py-3 outline-none text-[color:var(--site-text)] placeholder:text-[color:var(--site-muted)]"
                />
              </div>

              <p v-if="loginFormValid.passwordError" class="mt-1 text-sm text-red-500">
                {{ loginFormValid.passwordError }}
              </p>
            </div>

            <button type="submit" class="brand-button w-full justify-center">
              登录
            </button>
          </form>

          <form v-else class="mt-8 space-y-6" @submit.prevent="handleRegister">
            <div>
              <label class="mb-1 block text-sm text-[color:var(--site-text)]">用户名</label>
              <div class="flex items-center rounded-lg border border-[color:var(--site-line)] bg-white/85 px-3 dark:bg-white/5">
                <span class="mr-2 text-[color:var(--site-muted)]">👤</span>
                <input
                  v-model="registerForm.username"
                  type="text"
                  placeholder="请输入邮箱或者手机号"
                  class="flex-1 bg-transparent py-3 outline-none text-[color:var(--site-text)] placeholder:text-[color:var(--site-muted)]"
                />
              </div>

              <p v-if="registerValid.usernameError" class="mt-1 text-sm text-red-500">
                {{ registerValid.usernameError }}
              </p>
            </div>

            <div>
              <label class="mb-1 block text-sm text-[color:var(--site-text)]">验证码</label>
              <div class="flex gap-2">
                <div class="flex flex-1 items-center rounded-lg border border-[color:var(--site-line)] bg-white/85 px-3 dark:bg-white/5">
                  <span class="mr-2 text-[color:var(--site-muted)]">✉️</span>
                  <input
                    v-model="registerForm.code"
                    type="text"
                    placeholder="请输入验证码"
                    class="flex-1 bg-transparent py-3 outline-none text-[color:var(--site-text)] placeholder:text-[color:var(--site-muted)]"
                  />
                </div>

                <button
                  type="button"
                  :disabled="countdown > 0"
                  @click="sendCode"
                  class="rounded-lg bg-yellow-500 px-4 py-3 text-sm font-medium text-white shadow transition hover:bg-yellow-600 disabled:bg-gray-400"
                >
                  {{ countdown > 0 ? countdown + 's' : '发送' }}
                </button>
              </div>

              <p v-if="registerValid.codeError" class="mt-1 text-sm text-red-500">
                {{ registerValid.codeError }}
              </p>
            </div>

            <div>
              <label class="mb-1 block text-sm text-[color:var(--site-text)]">密码</label>
              <div class="flex items-center rounded-lg border border-[color:var(--site-line)] bg-white/85 px-3 dark:bg-white/5">
                <span class="mr-2 text-[color:var(--site-muted)]">🔒</span>
                <input
                  v-model="registerForm.password"
                  type="password"
                  placeholder="请输入密码"
                  class="flex-1 bg-transparent py-3 outline-none text-[color:var(--site-text)] placeholder:text-[color:var(--site-muted)]"
                />
              </div>

              <p v-if="registerValid.passwordError" class="mt-1 text-sm text-red-500">
                {{ registerValid.passwordError }}
              </p>
            </div>

            <div>
              <label class="mb-1 block text-sm text-[color:var(--site-text)]">确认密码</label>
              <div class="flex items-center rounded-lg border border-[color:var(--site-line)] bg-white/85 px-3 dark:bg-white/5">
                <span class="mr-2 text-[color:var(--site-muted)]">🔒</span>
                <input
                  v-model="registerForm.confirmPwd"
                  type="password"
                  placeholder="请再次输入密码"
                  class="flex-1 bg-transparent py-3 outline-none text-[color:var(--site-text)] placeholder:text-[color:var(--site-muted)]"
                />
              </div>

              <p v-if="registerValid.confirmPwdError" class="mt-1 text-sm text-red-500">
                {{ registerValid.confirmPwdError }}
              </p>
            </div>

            <button type="submit" class="brand-button w-full justify-center">
              注册
            </button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
useHead({
  title: '黄鸟加速器 | 登录账号',
  meta: [
    { name: 'description', content: '登录或注册黄鸟加速器账号。' }
  ],
})

import { ref } from "vue";
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const activeTab = ref("login");

const loginForm = ref({
  username: "",
  password: "",
});

const loginFormValid = ref({
  usernameError: "",
  passwordError: "",
});

const registerForm = ref({
  username: "",
  code: "",
  password: "",
  confirmPwd: "",
  invitCode: ""
});

const registerValid = ref({
  usernameError: "",
  passwordError: "",
  confirmPwdError: "",
  codeError:""
});

const countdown = ref(0);
let timer = null;

watch(
  () => route.query.tab,
  (tab) => {
    activeTab.value = tab === 'register' ? 'register' : 'login'
  },
  { immediate: true }
)

async function sendCode() {
  registerValid.value.usernameError = ""
  if (!registerForm.value.username) {
    registerValid.value.usernameError = "请输入账号"
    return;
  }

  const res = await goSendCode(registerForm.value.username)

  if (res.code == 200) {
      if (res.data) {
        registerForm.value.code = res.data
      }

      countdown.value = 60;
      timer = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
          clearInterval(timer);
        }
      }, 1000);
      return
  } else if (res.code == 604) {
      registerValid.value.usernameError = "用户名必须是邮箱或者手机号"
      return
  }else if (res.code == 605) {
      registerValid.value.usernameError = "用户名已存在"
      return
  }
}

async function handleLogin() {
  loginFormValid.value.usernameError = ""
  loginFormValid.value.passwordError = ""

  if (!loginForm.value.username)  {
    loginFormValid.value.usernameError = "账号不能为空"
    return;
  }

  if (!loginForm.value.password)  {
    loginFormValid.value.passwordError = "密码不能为空"
    return;
  }
  const res = await auth.login(loginForm.value.username, loginForm.value.password)

  if (res.code === 200) {
    router.push('/profile/person')
  } else if (res.code == 600) {
      loginFormValid.value.usernameError = '账号/密码不能为空';
    }else if (res.code == 601) {
      loginFormValid.value.usernameError = '账号已停用';
    }else if (res.code == 602) {
      loginFormValid.value.usernameError = '账号被锁定，请稍后再试';
    }else if (res.code == 603) {
      loginFormValid.value.passwordError = '账号密码错误';
    }else if (res.code == 604) {
      loginFormValid.value.usernameError = '账号格式不正确,使用邮箱或者手机号';
    }else if (res.code == 606) {
      loginFormValid.value.usernameError = '账号不存在';
    }
}

async function handleRegister() {
  registerValid.value.usernameError = ""
  registerValid.value.passwordError = ""
  registerValid.value.codeError = ""
  registerValid.value.confirmPwdError = ""

  if (!registerForm.value.username)  {
    registerValid.value.usernameError = "账号不能为空"
    return;
  }

  if (!registerForm.value.code)  {
      registerValid.value.codeError = "请输入验证码"
      return;
    }

  if (!registerForm.value.password)  {
    registerValid.value.passwordError = "密码不能为空"
    return;
  }

  if (registerForm.value.password != registerForm.value.confirmPwd)  {
    registerValid.value.confirmPwdError = "两次输入密码不一样"
    return;
  }

  const res = await auth.register(registerForm.value.username, registerForm.value.password, registerForm.value.code, registerForm.value.invitCode)

  if (res.code === 200) {
    router.push('/profile/person')
  }
}
</script>
