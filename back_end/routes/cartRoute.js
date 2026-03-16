import express from "express"
import * as cartC from "../controllers/cartController.js"


const router =express.Router()


router.post('/carts/chkcart',cartC.chkCart)
router.post('/carts/addcart',cartC.postCart)
router.post('/carts/addcartdtl',cartC.postCartDtl)
router.get('/carts/sumcart/:id',cartC.sumCart)
router.get('/carts/getcart/:id',cartC.getCart)
router.get('/carts/getcartdtl/:id',cartC.getCartDtl)
router.post('/carts/getcartbycus',cartC.getCartByCus)
router.delete('/carts/deletecartdtl/:id',cartC.deleteCartDtl)
router.delete('/carts/deletecartdtlone/:cartId/:pdId',cartC.deleteCartDtlOne)
router.put('/carts/confirmcart/:id',cartC.confirmCart)

export default router