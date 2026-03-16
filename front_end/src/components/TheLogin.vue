<template>
  <div class="row justify-content-center align-items-center mt-5">
    <div class="col-md-4 col-sm-10 text-center">
      <img src="../assets/LogoSRC.png" alt="Kushop" style="max-width:100%; height:auto;">
    </div>
    <div class="col-md-4 col-sm-10">
      <h4 class="fw-bold mb-4">เข้าสู่ระบบ</h4>
      <form @submit.prevent="handleSubmit()">
        <div class="form-floating mb-3">
          <input class="form-control" type="email" id="loginName" v-model="loginName" autocomplete="off" required placeholder="Email">
          <label for="loginName">Email</label>
        </div>
        <div class="form-floating mb-3">
          <input class="form-control" type="password" id="password" v-model="password" required placeholder="Password">
          <label for="password">Password</label>
        </div>
        <div class="d-flex gap-2">
          <router-link to="/register" class="btn btn-outline-secondary flex-grow-1">ลงทะเบียน</router-link>
          <button class="btn btn-primary flex-grow-1" type="submit">เข้าสู่ระบบ</button>
        </div>
      </form>
      <div v-if="message" class="mt-3 alert" :class="login ? 'alert-success' : 'alert-danger'">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import axios from 'axios'

axios.defaults.withCredentials = true

const authStore = useAuthStore()
const router = useRouter()
const loginName = ref(null)
const password = ref(null)
const login = ref(null)
const message = ref(null)

onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:3000/members/detail`)
    if (res.data.login) router.push('/pagemember')
  } catch {}
})

const handleSubmit = async () => {
  message.value = null
  try {
    const res = await axios.post(`http://localhost:3000/members/login`, {
      loginName: loginName.value,
      password: password.value
    })
    login.value = res.data.login
    if (login.value) {
      message.value = 'เข้าสู่ระบบสำเร็จ'
      authStore.login()
      router.push('/pagemember')
    } else {
      message.value = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
    }
  } catch (err) {
    login.value = false
    message.value = 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้'
  }
}
</script>
