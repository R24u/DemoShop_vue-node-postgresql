<template>
  <!-- Hero Section -->
  <div class="hero-section mt-4 mb-5 p-4 rounded-4">
    <h1 class="fw-bold mb-2">ยินดีต้อนรับสู่ <span class="text-primary">Kushop</span> 🛍️</h1>
    <p class="text-muted mb-3">
      ร้านค้าออนไลน์ที่รวบรวมสินค้าคุณภาพดีไว้ให้คุณเลือกสรร
      ครบครัน ราคาเป็นธรรม ส่งตรงถึงบ้าน สั่งได้ทุกวันตลอด 24 ชั่วโมง
    </p>
  </div>

  <h2 class="col-lg-9 col-md-8">สินค้าแนะนำ</h2>
  <div class="row g-3 mb-5">
    <div v-for="(pd, i) in products" :key="i" class="col-lg-4 col-md-5">
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

  <h2 class="col-lg-9 col-md-8">สินค้ายอดนิยม 🔥</h2>
  <div class="row g-3">
    <div v-for="(pd, i) in popular" :key="i" class="col-lg-4 col-md-5">
      <div class="card product-card position-relative">
        <span class="badge bg-danger position-absolute top-0 start-0 m-2" style="font-size:.8rem;">
          #{{ i + 1 }} ขายดี
        </span>
        <img :src="`http://localhost:3000/img_pd/${pd.pdId}.jpg`" class="card-img-top" alt="">
        <div class="card-body">
          <h5 class="card-title">{{ pd.pdName }}</h5>
          <p class="card-text mb-0">{{ pd.brand?.brandName || "ไม่ระบุยี่ห้อ" }}</p>
          <p class="card-text price">฿{{ pd.pdPrice.toLocaleString() }}</p>
          <p class="card-text text-muted small mb-2">ยอดขาย {{ pd.totalQty }} ชิ้น</p>
          <router-link :to="{ name: 'ProductShow', params: { pdId: pd.pdId } }" class="btn btn-primary mt-auto">
            ดูรายละเอียด
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";

const products = ref([]);
const popular = ref([]);

onMounted(async () => {
  try {
    const [res1, res2] = await Promise.all([
      axios.get(`http://localhost:3000/products/three`),
      axios.get(`http://localhost:3000/products/popular`)
    ])
    products.value = res1.data
    popular.value = res2.data
  } catch (err) {
    console.error(err.message)
  }
})
</script>
