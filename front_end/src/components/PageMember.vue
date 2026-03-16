<template>
  <div class="row mt-5 align-items-start g-4">
    <div class="col-md-4 col-sm-12 text-center">
      <img
        :src="imgOK
          ? `http://localhost:3000/img_mem/${memEmail}.jpg?t=${imageTimestamp}`
          : `http://localhost:3000/img_mem/default.jpg`"
        :alt="memEmail"
        class="rounded-circle border shadow-sm"
        style="width:140px; height:140px; object-fit:cover;"
      >
      <form @submit.prevent="uploadFile()" class="mt-3 d-flex flex-column align-items-center gap-2">
        <input class="form-control form-control-sm" type="file" @change="onFileChange" required>
        <button class="btn btn-sm btn-outline-primary w-100" type="submit">อัปโหลดรูป</button>
      </form>
      <div v-if="fileMessage" class="mt-2 alert py-1" :class="fileMessage === 'Upload ไม่สำเร็จ' ? 'alert-danger' : 'alert-success'">
        {{ fileMessage }}
      </div>
    </div>

    <div class="col-md-8 col-sm-12">
      <h3 class="fw-bold">{{ memName }}</h3>
      <p class="text-muted mb-1">{{ memEmail }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

axios.defaults.withCredentials = true

const memEmail = ref(null)
const memName = ref(null)
const imgOK = ref(false)
const fileMessage = ref(null)
const file = ref(null)
const imageTimestamp = ref(Date.now())

const onFileChange = (e) => { file.value = e.target.files[0] }

const uploadFile = async () => {
  if (!file.value) { fileMessage.value = 'เลือก File เพื่อ Upload'; return }
  const formData = new FormData()
  formData.append('memEmail', memEmail.value)
  formData.append('file', file.value)
  try {
    const res = await axios.post('http://localhost:3000/members/uploadImg', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    fileMessage.value = res.data.message
    imageTimestamp.value = Date.now()
    await chkImage()
  } catch {
    fileMessage.value = 'Upload ไม่สำเร็จ'
  }
}

const chkImage = () => new Promise((resolve) => {
  const img = new Image()
  img.src = `http://localhost:3000/img_mem/${memEmail.value}.jpg`
  img.onload = () => { imgOK.value = true; resolve() }
  img.onerror = () => { imgOK.value = false; resolve() }
})

onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:3000/members/detail`)
    memEmail.value = res.data.memEmail
    memName.value = res.data.memName
  } catch (err) {
    console.error(err.message)
  }
  await chkImage()
})
</script>
