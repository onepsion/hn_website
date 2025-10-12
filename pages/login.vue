<template>
  <div class="min-h-screen flex p-2 lg:p-20 items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
    <div class="w-full max-w-md">
      <!-- 卡片容器 -->
      <div class="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 transform transition-all hover:scale-[1.02]">
        <!-- Tabs -->
        <div class="flex justify-around mb-8">
          <button
            class="pb-2 text-lg font-semibold transition-colors"
            :class="activeTab === 'login' ? 'border-b-2 border-yellow-500 text-yellow-600 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-400 '"
            @click="activeTab = 'login'"
          >
            登录
          </button>
          <button
            class="pb-2 text-lg font-semibold transition-colors"
            :class="activeTab === 'register' ? 'border-b-2 border-yellow-500 text-yellow-600 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-400 '"
            @click="activeTab = 'register'"
          >
            注册
          </button>
        </div>

        <!-- 登录表单 -->
        <form v-if="activeTab === 'login'" class="space-y-6" @submit.prevent="handleLogin">
          <div>
            <label class="block text-sm mb-1 text-gray-600 dark:text-gray-300">用户名</label>
            <div class="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 px-3">
              <span class="text-gray-400 dark:text-gray-300 mr-2">👤</span>
              <input
                v-model="loginForm.username"
                type="text"
                placeholder="请输入邮箱或者手机号"
                class="flex-1 py-2 bg-transparent outline-none dark:text-gray-200"
              />
            </div>
            
            <p
              v-if="loginFormValid.usernameError"
              class="mt-1 text-sm text-red-500 dark:text-red-400"
            >
              {{ loginFormValid.usernameError }}
            </p>
          </div>
          <div>
            <label class="block text-sm mb-1 text-gray-600 dark:text-gray-300">密码</label>
            <div class="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 px-3">
              <span class="text-gray-400 dark:text-gray-300 mr-2">🔒</span>
              <input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                class="flex-1 py-2 bg-transparent outline-none dark:text-gray-200"
              />
            </div>
            <p
              v-if="loginFormValid.passwordError"
              class="mt-1 text-sm text-red-500 dark:text-red-400"
            >
              {{ loginFormValid.passwordError }}
            </p>
          </div>
          <button type="submit" class="w-full py-3 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-500 hover:to-yellow-500 text-white font-semibold shadow-md transition">
            登录
          </button>
        </form>

        <!-- 注册表单 -->
        <form v-else class="space-y-6" @submit.prevent="handleRegister">
          <div>
            <label class="block text-sm mb-1 text-gray-600 dark:text-gray-300">用户名</label>
            <div class="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 px-3">
              <span class="text-gray-400 dark:text-gray-300 mr-2">👤</span>
              <input
                v-model="registerForm.username"
                type="text"
                placeholder="请输入邮箱或者手机号"
                class="flex-1 py-2 bg-transparent outline-none dark:text-gray-200"
              />
            </div>
            <p
              v-if="registerValid.usernameError"
              class="mt-1 text-sm text-red-500 dark:text-red-400"
            >
              {{ registerValid.usernameError }}
            </p>
          </div>
          
          <div>
            <label class="block text-sm mb-1 text-gray-600 dark:text-gray-300">验证码</label>
            <div class="flex space-x-2">
                <!-- 输入框输入框变窄，通过flex使用 w-1/2 限制宽度 -->
                <div class="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 px-3 w-2/3">
                  <span class="text-gray-400 dark:text-gray-300 mr-2">✉️</span>
                  <input
                    v-model="registerForm.code"
                    type="text"
                    placeholder="请输入验证码"
                    class="flex-1 py-2 bg-transparent outline-none dark:text-gray-200"
                  />
                </div>
                
                <!-- 发送按钮变宽，使用 flex-1 填充剩余空间 -->
                <button
                  type="button"
                  :disabled="countdown > 0"
                  @click="sendCode"
                  class="flex-1 px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium shadow disabled:bg-gray-400 transition"
                >
                  {{ countdown > 0 ? countdown + 's' : '发送' }}
                </button>
              </div>
              <p
                v-if="registerValid.codeError"
                class="mt-1 text-sm text-red-500 dark:text-red-400"
              >
                {{ registerValid.codeError }}
              </p>
          </div>
          <div>
            <label class="block text-sm mb-1 text-gray-600 dark:text-gray-300">密码</label>
            <div class="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 px-3">
              <span class="text-gray-400 dark:text-gray-300 mr-2">🔒</span>
              <input
                v-model="registerForm.password"
                type="password"
                placeholder="请输入密码"
                class="flex-1 py-2 bg-transparent outline-none dark:text-gray-200"
              />
            </div>
            <p
                v-if="registerValid.passwordError"
                class="mt-1 text-sm text-red-500 dark:text-red-400"
              >
                {{ registerValid.passwordError }}
              </p>
          </div>
          <div>
            <label class="block text-sm mb-1 text-gray-600 dark:text-gray-300">确认密码</label>
            <div class="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 px-3">
              <span class="text-gray-400 dark:text-gray-300 mr-2">🔒</span>
              <input
                v-model="registerForm.confirmPwd"
                type="password"
                placeholder="请输入手机号"
                class="flex-1 py-2 bg-transparent outline-none dark:text-gray-200"
              />
            </div>
            <p
                v-if="registerValid.confirmPwdError"
                class="mt-1 text-sm text-red-500 dark:text-red-400"
              >
                {{ registerValid.confirmPwdError }}
              </p>
          </div>
          <button type="submit" class="w-full py-3 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-500 hover:to-yellow-500 text-white font-semibold shadow-md transition">
            注册
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>

useHead({
  title: '黄鸟加速器 | 欢迎使用黄鸟加速器',
  meta: [
    { name: 'description', content: '黄鸟加速 - 突破网络限制，提供高速专线服务，畅享专业、安全、极速的网络体验，支持Windows, Macos, Android, IOS系统，永久免费使用。' }
  ],
})

import { ref } from "vue";
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const router = useRouter()
const auth = useAuthStore()  // 调用 Pinia Store

const activeTab = ref("login");

// 登录表单
const loginForm = ref({
  username: "",
  password: "",
});

const loginFormValid = ref({
  usernameError: "",
  passwordError: "",
});


// 注册表单
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


// 倒计时
const countdown = ref(0);
let timer = null;

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
    // 登录成功跳转
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
    // 登录成功跳转
    router.push('/profile/person')
  } 
}
</script>
