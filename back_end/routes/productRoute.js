import express from "express"
//import { getAllProduct,postProduct,getProductById,putProduct,deleteProduct } from "../controllers/productController.js"
import * as productC from "../controllers/productController.js"
const router = express.Router()


router.get('/products/search/:id',productC.getSearchProduct)
router.get('/products/popular',productC.getPopularProducts)
router.get('/products',productC.getAllProduct)
router.get('/products/three',productC.getThreeProduct)
router.get('/products/brand/:id',productC.getProductByBrandId)
router.get('/products/:id',productC.getProductById)
router.post('/products',productC.postProduct)
router.post('/products/upload/:id',productC.uploadProductImg)
router.put('/products/:id',productC.putProduct)
router.delete('/products/:id',productC.deleteProduct)

export default router
