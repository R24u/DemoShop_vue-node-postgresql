<template>
  <div class="ms-n3">
  <form @submit.prevent="searchProduct()" class="d-flex gap-2 my-4">
    <h2 class="fw-bold me-auto mb-0">สินค้า</h2>
    <select v-model="sort" class="form-select" style="max-width:180px">
      <option value="">เรียงตาม</option>
      <option value="asc">ราคา: ต่ำ → สูง</option>
      <option value="desc">ราคา: สูง → ต่ำ</option>
    </select>
    <input type="text" class="form-control" style="max-width:220px" v-model="stext" placeholder="ค้นหา...">
    <button class="btn btn-primary" type="submit">ค้นหา</button>
  </form>

  <div class="row g-4">
    <!-- Sidebar ซ้าย -->
    <div class="col-lg-3 col-md-4">
      <div class="border rounded p-3">
        <h5 class="fw-bold mb-3">SHOP</h5>
        <label class="form-label fw-semibold">หมวดหมู่</label>
        <select v-model="brand" class="form-select">
          <option value="">ทั้งหมด</option>
          <option v-for="b in [...new Set(products.map(p=>p.brand?.brandName).filter(Boolean))]" :key="b">{{ b }}</option>
        </select>

        <!-- ช่วงราคา -->
        <div class="border-top pt-3 mt-3">
          <span class="fw-semibold">ราคา</span>
          <p class="small text-muted mb-2">สูงสุด {{ maxPrice.toLocaleString() }} ฿</p>
          <div class="d-flex gap-2 mb-2">
            <div class="input-group input-group-sm">
              <span class="input-group-text">จาก</span>
              <input v-model.number="priceMin" type="number" class="form-control" min="0">
            </div>
            <div class="input-group input-group-sm">
              <span class="input-group-text">ไปยัง</span>
              <input v-model.number="priceMax" type="number" class="form-control">
            </div>
          </div>
          <input type="range" class="form-range" v-model.number="priceMax" :min="0" :max="maxPrice">
        </div>
      </div>
    </div>
    

    <!-- Product Grid ขวา -->
    <div class="col-lg-9 col-md-8">
      <div class="row g-3">
        <div v-for="(pd, i) in filteredProducts" :key="i" class="col-lg-4 col-md-6 col-sm-6">
          <div class="card product-card h-100">
            <img :src="`http://localhost:3000/img_pd/${pd.pdId}.jpg`" class="card-img-top" alt="">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">{{ pd.pdName }}</h5>
              <p class="card-text mb-0">{{ pd.brand?.brandName || "ไม่ระบุยี่ห้อ" }}</p>
              <p class="card-text price">฿{{ pd.pdPrice.toLocaleString() }}</p>
              <router-link :to="{ name: 'ProductShow', params: { pdId: pd.pdId } }" class="btn btn-primary mt-auto">
                ดูรายละเอียด
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>



<script setup>
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'

const products = ref([])
const stext = ref('')
const brand = ref('')
const sort = ref('')
const priceMin = ref(0)
const priceMax = ref(0)

const maxPrice = computed(() => Math.max(0, ...products.value.map(p => p.pdPrice)))

const filteredProducts = computed(() => {
  const max = priceMax.value || maxPrice.value
  let list = products.value.filter(p => {
    const matchBrand = !brand.value || p.brand?.brandName === brand.value
    const matchPrice = p.pdPrice >= priceMin.value && p.pdPrice <= max
    return matchBrand && matchPrice
  })
  if (sort.value === 'asc') list = [...list].sort((a, b) => a.pdPrice - b.pdPrice)
  if (sort.value === 'desc') list = [...list].sort((a, b) => b.pdPrice - a.pdPrice)
  return list
})

const searchProduct = async () => {
  try {
    const res = await axios.get(`http://localhost:3000/products/search/${stext.value}`)
    products.value = res.data
  } catch (err) {
    console.error(err.message)
  }
}

onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:3000/products`)
    products.value = res.data
  } catch (err) {
    console.error(err.message)
  }
})
</script>
