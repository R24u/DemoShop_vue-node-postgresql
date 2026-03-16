<template>
  <div class="row justify-content-center mt-5">
    <div class="col-md-5 col-sm-10">
      <div class="card p-4">
        <h4 class="fw-bold mb-4">ลงทะเบียนสมาชิก</h4>
        <form @submit.prevent="handleSubmit()">
          <div class="form-floating mb-3">
            <input type="email" class="form-control" id="memEmail" autocomplete="off" required placeholder="Email" v-model.trim="memEmail">
            <label for="memEmail">Email</label>
          </div>
          <div class="form-floating mb-3">
            <input type="text" class="form-control" id="memName" autocomplete="off" required placeholder="ชื่อ" v-model="memName">
            <label for="memName">ชื่อ</label>
          </div>
          <div class="form-floating mb-4">
            <input type="password" class="form-control" id="password" autocomplete="off" required placeholder="Password" v-model="password">
            <label for="password">Password</label>
          </div>
          <button class="btn btn-primary w-100" type="submit">ลงทะเบียน</button>
        </form>
        <div v-if="message" class="mt-3 alert" :class="regist ? 'alert-success' : 'alert-danger'">
          {{ regist ? 'ลงทะเบียนสำเร็จ - ' : 'ลงทะเบียนผิดพลาด - ' }}{{ message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const memEmail = ref(null)
const memName = ref(null)
const password = ref(null)
const regist = ref(null)
const message = ref(null)

const handleSubmit = async () => {
  try {
    const res = await axios.post(`http://localhost:3000/members`, {
      memEmail: memEmail.value,
      memName: memName.value,
      password: password.value
    })
    regist.value = res.data.regist
    message.value = res.data.message
  } catch (err) {
    console.error(err)
  }
}
</script>
