<template>
  <div v-if="errorMsg" class="alert alert-danger mt-3">{{ errorMsg }}</div>

  <div v-if="memEmail === cusId">
    <div v-for="(ct, i) in cart" :key="i" class="card mt-4 p-3">
      <h5 class="fw-bold mb-1">คำสั่งซื้อ #{{ ct.cartId }}</h5>
      <p class="text-muted small mb-1">{{ formattedDate(ct.cartDate) }}</p>
      <p class="mb-3">{{ ct.sqty }} ชิ้น &nbsp;·&nbsp; <strong>฿{{ (ct.sprice ?? 0).toLocaleString() }}</strong></p>
      <div class="d-flex gap-2 align-items-center">
        <template v-if="!ct.cartCf">
          <button class="btn btn-outline-danger btn-sm" @click="deleteCart">
            <i class="bi-cart-x-fill"></i> ลบตะกร้า
          </button>
          <button class="btn btn-primary btn-sm ms-auto" @click="confirmOrder">
            <i class="bi-check-lg"></i> ยืนยันสั่งซื้อ
          </button>
        </template>
        <span v-else class="badge bg-success ms-auto"><i class="bi-check-circle me-1"></i>ยืนยันแล้ว</span>
      </div>
    </div>

    <table class="table mt-3">
      <thead>
        <tr>
          <td>#</td>
          <td>รหัส</td>
          <td>สินค้า</td>
          <td class="text-end">ราคา</td>
          <td class="text-center">จำนวน</td>
          <td class="text-end">รวม</td>
          <td></td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(d, i) in cartDtl" :key="i">
          <td>{{ d.row_number }}</td>
          <td>{{ d.pdId }}</td>
          <td>
            <router-link :to="`/productshow/${d.pdId}`">{{ d.pdName }}</router-link>
          </td>
          <td class="text-end">{{ d.price }}</td>
          <td class="text-center">{{ d.qty }}</td>
          <td class="text-end">{{ ((d.price * d.qty) ?? 0).toLocaleString() }}</td>
          <td class="text-center">
            <button v-if="!cart[0]?.cartCf" class="btn btn-outline-danger btn-sm" @click="deleteCartDtlOne(d.pdId)">
              <i class="bi-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-else class="alert alert-danger mt-4">คุณไม่มีสิทธิ์ดูรายการนี้</div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { useCartStore } from '@/stores/cartStore'

axios.defaults.withCredentials = true

const route = useRoute()
const cartStore = useCartStore()
const cart = ref([])
const cartDtl = ref([])
const cartId = ref(null)
const cusId = ref(null)
const memEmail = ref(null)
const errorMsg = ref(null)

const formattedDate = (d) => new Date(d).toISOString().slice(0, 10)

onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:3000/members/detail`)
    memEmail.value = res.data.memEmail
  } catch (err) { console.error(err.message) }

  cartId.value = route.params.cartId

  try {
    const res = await axios.get(`http://localhost:3000/carts/getcart/${cartId.value}`)
    cart.value = res.data
    cusId.value = res.data[0].cusId
  } catch (err) { console.error(err) }

  try {
    const res = await axios.get(`http://localhost:3000/carts/getcartdtl/${cartId.value}`)
    cartDtl.value = res.data
  } catch (err) { console.error(err) }
})

async function deleteCart() {
  const res = await axios.delete(`http://localhost:3000/carts/deletecartdtl/${cartId.value}`)
  if (res.data.deleteOK) window.location.reload()
}

async function deleteCartDtlOne(pdId) {
  const cf = window.confirm('ต้องการลบสินค้านี้ออกจากตะกร้า?')
  if (!cf) return
  const res = await axios.delete(`http://localhost:3000/carts/deletecartdtlone/${cartId.value}/${pdId}`)
  if (res.data.deleteOK) window.location.reload()
}

async function confirmOrder() {
  const res = await axios.put(`http://localhost:3000/carts/confirmcart/${cartId.value}`)
  if (res.data.confirmOK) window.location.href = '/cartlist'
}
</script>
