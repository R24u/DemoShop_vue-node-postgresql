import express from "express"
//import { getAllProduct,postProduct,getProductById,putProduct,deleteProduct } from "../controllers/productController.js"
import * as memberC from "../controllers/memberController.js"
const router = express.Router()


// router.get('/products/search/:id',productC.getSearchProduct)
// router.get('/products',productC.getAllProduct)
// router.get('/products/three',productC.getThreeProduct)
// router.get('/products/brand/:id',productC.getProductByBrandId)
router.get('/members/detail',memberC.getMember)
router.get('/members/logout',memberC.logoutMember)
router.post('/members',memberC.postMember)
router.post('/members/login',memberC.loginMember)
router.post('/members/uploadimg',memberC.uploadImg)

export default router
