<template>
  <div v-for="(pd, i) in products" :key="i" class="container mt-4">
    <div class="row g-4">
      <!-- รูปสินค้า -->
      <div class="col-md-5 col-sm-12">
        <div class="position-relative">

          <img :src="`http://localhost:3000/img_pd/${pd.pdId}.jpg`"
               class="img-fluid rounded border w-100" 
               style="object-fit: contain; background:#fff; min-height:350px;" alt="">
        </div>
        <!-- thumbnail -->
        <div class="mt-2">
          <img :src="`http://localhost:3000/img_pd/${pd.pdId}.jpg`"
               class="rounded border" style="width:60px; height:60px; object-fit:cover; cursor:pointer;" alt="">
        </div>
      </div>

      <!-- รายละเอียด -->
      <div class="col-md-7 col-sm-12">
        <h2 class="fw-bold mb-2">{{ pd.pdName }}</h2>

        <!-- คำอธิบาย -->
        <p class="text-muted mb-3" style="line-height:1.8;">{{ pd.pdRemark }}</p>

        <!-- ราคา -->
        <h3 class="text-success fw-bold mb-4">฿{{ pd.pdPrice.toLocaleString() }}</h3>

        <!-- เลือกจำนวน -->
        <div class="d-flex align-items-center gap-3 mb-3">
          <label class="fw-semibold mb-0">จำนวน :</label>
          <div class="d-flex align-items-center border rounded" style="width:120px;">
            <button class="btn btn-sm px-2" @click="qty > 1 && qty--">-</button>
            <input v-model.number="qty" type="number" min="1" class="form-control form-control-sm text-center border-0 px-0" style="width:50px;">
            <button class="btn btn-sm px-2" @click="qty++">+</button>
          </div>
        </div>

        <!-- ปุ่มหลัก -->
        <div class="d-flex flex-wrap gap-2 mb-4">
          <button class="btn btn-primary btn-lg px-4" @click="chkLogin()">
            <i class="bi bi-cart-plus me-2"></i>ใส่ตะกร้า
          </button>
          <button class="btn btn-outline-warning px-4" @click="openEdit(pd)">
            <i class="bi bi-pencil me-2"></i>แก้ไข
          </button>
        </div>

        <!-- หมวดหมู่ / แบรนด์ -->
        <p class="mb-1"><strong>หมวดหมู่ :</strong> <a href="#" class="text-decoration-none text-success">สินค้า</a></p>
        <p class="mb-0"><strong>แบรนด์ :</strong> <a href="#" class="text-decoration-none text-success">{{ pd.brand?.brandName || "ไม่ระบุ" }}</a></p>
      </div>
    </div>
  </div>

    <!-- Edit Modal -->
  <div v-if="showEditForm" class="modal-overlay" @click.self="showEditForm = false">
    <div class="card p-4" style="width:440px">
      <h5 class="fw-bold mb-4">แก้ไขสินค้า</h5>
      <div class="mb-3">
        <label class="form-label">ชื่อสินค้า</label>
        <input v-model="editData.pdName" type="text" class="form-control">
      </div>
      <div class="mb-3">
        <label class="form-label">ราคา</label>
        <input v-model="editData.pdPrice" type="number" class="form-control">
      </div>
      <div class="mb-3">
        <label class="form-label">ชื่อยี่ห้อ (brandName)</label>
        <input v-model="editData.brandName" type="text" class="form-control">
      </div>
      <div class="mb-3">
        <label class="form-label">ยี่ห้อ (brandId)</label>
        <input v-model="editData.brandId" type="text" class="form-control">
      </div>
      <div class="mb-3">
        <label class="form-label">รายละเอียด</label>
        <input v-model="editData.pdRemark" type="text" class="form-control">
      </div>
      <div class="mb-4">
        <label class="form-label">รูปสินค้า</label>
        <img :src="previewImage || `http://localhost:3000/img_pd/${editData.pdId}.jpg`" class="d-block mb-2 rounded border" style="height:100px; object-fit:contain;">
        <input type="file" class="form-control" accept="image/*" @change="onImageChange">
      </div>
      <div v-if="editMessage" class="alert alert-success py-1 small">{{ editMessage }}</div>
      <div class="d-flex gap-2">
        <button class="btn btn-warning flex-grow-1" @click="saveEdit">บันทึก</button>
        <button class="btn btn-secondary flex-grow-1" @click="showEditForm = false">ยกเลิก</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { useCartStore } from '@/stores/cartStore'

axios.defaults.withCredentials = true

const cartStore = useCartStore()
const route = useRoute()
const products = ref([])
const id = ref(null)
const memEmail = ref(null)
const cartId = ref(null)

const qty = ref(1)

const showEditForm = ref(false)
const editMessage = ref(null)
const editData = ref({})
const editImage = ref(null)
const previewImage = ref(null)

const openEdit = (pd) => {
  editData.value = { pdId: pd.pdId, pdName: pd.pdName, pdPrice: pd.pdPrice, pdRemark: pd.pdRemark, brandName: pd.brand?.brandName ?? '', brandId: pd.brand?.brandId ?? pd.brandId }
  editImage.value = null
  previewImage.value = null
  editMessage.value = null
  showEditForm.value = true
}

const onImageChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  editImage.value = file
  previewImage.value = URL.createObjectURL(file)
}

const saveEdit = async () => {
  try {
    const res = await axios.put(`http://localhost:3000/products/${editData.value.pdId}`, editData.value)
    if (res.data.message === 'update success') {
      if (editImage.value) {
        const formData = new FormData()
        formData.append('image', editImage.value)
        await axios.post(`http://localhost:3000/products/upload/${editData.value.pdId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }
      editMessage.value = 'บันทึกสำเร็จ'
      setTimeout(() => window.location.reload(), 1000)
    }
  } catch (err) {
    editMessage.value = 'เกิดข้อผิดพลาด: ' + err.message
  }
}

const chkLogin = async () => {
  try {
    const res = await axios.get(`http://localhost:3000/members/detail`)
    if (!res.data.login) { alert('ยังไม่ได้ Login ต้อง Login ก่อนซื้อสินค้า'); return }
    memEmail.value = res.data.memEmail
    const chk = await axios.post(`http://localhost:3000/carts/chkcart`, { memEmail: memEmail.value })
    cartId.value = chk.data.cartId
    if (!cartId.value) {
      const add = await axios.post(`http://localhost:3000/carts/addcart`, { cusId: memEmail.value })
      cartId.value = add.data.messageAddCart
    }
    await axios.post(`http://localhost:3000/carts/addcartdtl`, { cartId: cartId.value, pdId: id.value, pdPrice: products.value[0].pdPrice, qty: qty.value })
    cartStore.updateQty()
    cartStore.setId(cartId.value)
  } catch (err) {
    console.error(err.message)
  }
}

onMounted(async () => {
  id.value = route.params.pdId
  try {
    const res = await axios.get(`http://localhost:3000/products/${id.value}`)
    products.value = res.data
  } catch (err) {
    console.error(err.message)
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.45);
  display: flex; align-items: center; justify-content: center;
  z-index: 9999;
}
</style>
