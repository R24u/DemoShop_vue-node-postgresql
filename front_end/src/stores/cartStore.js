import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const theQty = ref(0)
  const cartId = ref(null)

  const updateQty = () => {
    theQty.value++
  }

  const setId = (id) => {
    cartId.value = id
  }

  const resetCart = () => {
    theQty.value = 0
    cartId.value = null
  }

  return { theQty, cartId, updateQty, setId, resetCart }
})
