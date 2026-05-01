<template>
  <div class="overflow-hidden">
    <section class="site-shell min-h-[calc(100vh-120px)] px-4 pb-16 pt-20 sm:pt-24">
    <div class="flex flex-col items-center space-y-8">

    <div class="glass-panel w-full max-w-3xl rounded-[28px] p-6 text-center sm:p-8">
      <!-- 1. 英雄区 -->
      <div class="space-y-4">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-[color:var(--site-text)] leading-snug sm:leading-tight text-center">
          🚀 快速注册，立即体验我们的产品！
          </h1>

        <p class="text-[color:var(--site-muted)] md:text-lg">
          加入我们，解锁专属功能，让生活更简单、更高效
        </p>
      </div>

      <!-- 2. 奖励提示区 -->
      <div class="mt-6 bg-gradient-to-r from-pink-400 to-purple-500 text-white p-4 rounded-xl shadow-md w-full max-w-md mx-auto text-center font-semibold">
        🎁 通过邀请注册，立即获得 <span class="underline">100 积分奖励</span>！
      </div>
    </div>

    <!-- 3. 注册表单 -->
    <form class="glass-panel w-full max-w-md space-y-6 rounded-[28px] p-6 sm:p-7" @submit.prevent="handleRegister">
          <div>
            <label class="block text-sm mb-1 text-[color:var(--site-text)]">用户名</label>
            <div class="flex items-center rounded-lg border border-[color:var(--site-line)] bg-white/85 px-3 dark:bg-white/5">
              <span class="text-[color:var(--site-muted)] mr-2">👤</span>
              <input
                v-model="registerForm.username"
                type="text"
                placeholder="请输入邮箱或者手机号"
                class="flex-1 py-3 bg-transparent outline-none text-[color:var(--site-text)] placeholder:text-[color:var(--site-muted)]"
              />
            </div>
            <p
              v-if="registerValid.usernameError"
              class="mt-1 text-sm text-red-500"
            >
              {{ registerValid.usernameError }}
            </p>
          </div>
          
          <div>
            <label class="block text-sm mb-1 text-[color:var(--site-text)]">验证码</label>
            <div class="flex gap-2">
                <div class="flex items-center rounded-lg border border-[color:var(--site-line)] bg-white/85 px-3 w-2/3 dark:bg-white/5">
                  <span class="text-[color:var(--site-muted)] mr-2">✉️</span>
                  <input
                    v-model="registerForm.code"
                    type="text"
                    placeholder="请输入验证码"
                    class="flex-1 py-3 bg-transparent outline-none text-[color:var(--site-text)] placeholder:text-[color:var(--site-muted)]"
                  />
                </div>
                
                <button
                  type="button"
                  :disabled="countdown > 0"
                  @click="sendCode"
                  class="flex-1 px-4 py-3 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium shadow disabled:bg-gray-400 transition"
                >
                  {{ countdown > 0 ? countdown + 's' : '发送' }}
                </button>
              </div>
              <p
                v-if="registerValid.codeError"
                class="mt-1 text-sm text-red-500"
              >
                {{ registerValid.codeError }}
              </p>
          </div>
          <div>
            <label class="block text-sm mb-1 text-[color:var(--site-text)]">密码</label>
            <div class="flex items-center rounded-lg border border-[color:var(--site-line)] bg-white/85 px-3 dark:bg-white/5">
              <span class="text-[color:var(--site-muted)] mr-2">🔒</span>
              <input
                v-model="registerForm.password"
                type="password"
                placeholder="请输入密码"
                class="flex-1 py-3 bg-transparent outline-none text-[color:var(--site-text)] placeholder:text-[color:var(--site-muted)]"
              />
            </div>
            <p
                v-if="registerValid.passwordError"
                class="mt-1 text-sm text-red-500"
              >
                {{ registerValid.passwordError }}
              </p>
          </div>
          <div>
            <label class="block text-sm mb-1 text-[color:var(--site-text)]">确认密码</label>
            <div class="flex items-center rounded-lg border border-[color:var(--site-line)] bg-white/85 px-3 dark:bg-white/5">
              <span class="text-[color:var(--site-muted)] mr-2">🔒</span>
              <input
                v-model="registerForm.confirmPwd"
                type="password"
                placeholder="请输入手机号"
                class="flex-1 py-3 bg-transparent outline-none text-[color:var(--site-text)] placeholder:text-[color:var(--site-muted)]"
              />
            </div>
            <p
                v-if="registerValid.confirmPwdError"
                class="mt-1 text-sm text-red-500"
              >
                {{ registerValid.confirmPwdError }}
              </p>
          </div>
          <button type="submit" class="brand-button w-full justify-center">
            注册
          </button>
    </form>

    <!-- 4. 产品亮点 -->
    <div class="surface-card p-6 rounded-2xl w-full max-w-md space-y-4">
      <h2 class="text-xl font-bold text-[color:var(--site-text)]">产品亮点</h2>
      <ul class="list-disc list-inside text-[color:var(--site-muted)] space-y-2">
        <li>🔥 提供永久免费服务</li>
        <li>✅ 简单易用，一键连接</li>
        <li>✅ 数据安全可靠，隐私保护到位</li>
        <li>✅ 高效提升工作/生活效率</li>
      </ul>
    </div>

    <!-- 5. 信任证明 -->
    <div class="surface-card p-4 rounded-2xl w-full max-w-md text-center">
      <p class="text-[color:var(--site-muted)]">今日已有 <span class="font-bold text-[color:var(--site-text)]">10,000+</span> 用户成功注册并使用</p>
    </div>

    <!-- 6. 页尾 CTA -->
    <div class="text-center">
      <button @click="scrollToTop" class="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition-all duration-300">
        返回顶部立即注册
      </button>
    </div>

    </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
const router = useRouter()
const auth = useAuthStore()
const route = useRoute()

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
let timer = null as any;

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

onMounted(() => {
  const refCode = (route.query.code as string) || ''
  registerForm.value.invitCode = refCode
})

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
</script>
