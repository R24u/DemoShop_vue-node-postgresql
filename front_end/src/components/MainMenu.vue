<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary shadow-sm">
    <div class="container-fluid">
      <router-link class="navbar-brand fw-bold" to="/">Kushop</router-link>
      <button
        class="navbar-toggler" type="button" data-bs-toggle="collapse"
        data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
        aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link to="/"><div class="nav-link">Home</div></router-link>
          </li>
          <li class="nav-item">
            <router-link to="/product"><div class="nav-link">Product</div></router-link>
          </li>
          <li class="nav-item" v-if="login">
            <router-link to="/pagemember" style="text-decoration: none">
              <div class="nav-link fw-bold">{{ memName }}</div>
            </router-link>
          </li>
          <li class="nav-item " v-if="login">
            <router-link to="/cartlist" style="text-decoration: none;">
              <div class="nav-link fw-bold">Cart</div>
            </router-link>
          </li>
          <li class="nav-item  pe-3"  v-if="login">
            <CartInfo />
          </li>
          <li class="nav-item" v-if="login">
            <a href="#" @click="memLogout()" style="text-decoration: none">
              <div class="nav-link fw-bold text-danger">ลงชื่อออก</div>
            </a>
          </li>
          <li class="nav-item" v-if="!login">
            <router-link to="/login" style="text-decoration: none">
              <div class="nav-link">Login</div>
            </router-link>
          </li>

        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useAuthStore } from "@/stores/authStore";
import CartInfo from './CartInfo.vue';
axios.defaults.withCredentials = true;


const authStore = useAuthStore()
const router = useRouter()
const member = ref(null)
const memEmail = ref(null)
const memName = ref(null)
const dutyId = ref(null)
const login = ref(false)

watch(
  () => authStore.isLogin,
  () => {
    getMember()
  }
)

onMounted(async () => {
  await getMember()
})


const getMember = async () => {
  try {
    const res = await axios.get(`http://localhost:3000/members/detail`)
    member.value = res.data
    memEmail.value = member.value.memEmail
    memName.value = member.value.memName
    dutyId.value = member.value.dutyId
    login.value = member.value.login
  } catch (err) {
    console.error('Error fetching member details:', err.message)
  }
}


const memLogout = async () => {
  const cf = window.confirm("ต้องการออกจากระบบ?");
  if (cf) {
    try {
      await axios.get(`http://localhost:3000/members/logout`);
      await getMember()   // ← เพิ่มบรรทัดนี้ เพื่อ refresh สถานะ login
      router.push("/");
    } catch (err) {
      console.log(err);
    }
  }
};


</script>

<style></style>
