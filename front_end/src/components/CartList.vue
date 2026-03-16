<template>
  <div class="mt-4">
    <h4 class="fw-bold mb-3">รายการสั่งซื้อ <small class="text-muted fw-normal fs-6">{{ memEmail }}</small></h4>
    <table class="table table-hover">
      <thead>
        <tr>
          <td>#</td>
          <td>เลขที่</td>
          <td>วันที่</td>
          <td class="text-center">จำนวน</td>
          <td class="text-end">ยอดเงิน</td>
          <td class="text-center">ยืนยัน</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(ct, i) in cart" :key="i">
          <td>{{ ct.row_number }}</td>
          <td>
            <router-link :to="`/cartshow/${ct.cartId}`" class="text-primary">{{ ct.cartId }}</router-link>
          </td>
          <td>{{ formattedDate(ct.cartDate) }}</td>
          <td class="text-center">{{ ct.sqty ?? 0 }}</td>
          <td class="text-end">{{ (ct.sprice ?? 0).toLocaleString() }}</td>
          <td class="text-center">
            <i :class="ct.cartCf ? 'bi bi-check-lg text-success' : 'bi bi-dash text-muted'"></i>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

axios.defaults.withCredentials = true

const cart = ref([])
const memEmail = ref(null)

const formattedDate = (d) => new Date(d).toISOString().slice(0, 10)

onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:3000/members/detail`)
    memEmail.value = res.data.memEmail
  } catch (err) { console.error(err.message) }
  try {
    const res = await axios.post(`http://localhost:3000/carts/getcartbycus`, { id: memEmail.value })
    cart.value = res.data
  } catch (err) { console.error(err) }
})
</script>
