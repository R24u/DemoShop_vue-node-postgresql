import express from "express"
import database from "./services/database.js"
import dotenv from 'dotenv'
import bodyParser from "body-parser"
import productRoute from "./routes/productRoute.js"
import memberRoute from "./routes/memberRoute.js"
import cartRoute from "./routes/cartRoute.js"
import cors from "cors"
import cookieParser from "cookie-parser"



dotenv.config()

const app =express()
const port = process.env.PORT

// เรียกใช้ cors
// app.use(cors())
// กำหนด Option ของ cors เพิ่มเติมเมื่อมีการส่งข้อมูล Cookie หรือ Header
app.use(cors({
    origin:['http://localhost', 'http://127.0.0.1',
            'http://localhost:5173','http://127.0.0.1:5173',
            'http://localhost:4173','http://127.0.0.1:4173'], //Domain ของ Frontend
    methods:['GET','POST','PUT','DELETE'], //Method ที่อนุญาต
    credentials:true  //ให้ส่งข้อมูล Header+Cookie ได้
}))

app.use("/img_pd",express.static("img_pd"))
app.use("/img_mem",express.static("img_mem"))

app.use(bodyParser.json())

app.use(cookieParser());

app.use(productRoute)
app.use(memberRoute)
app.use(cartRoute)
app.post('/products',async(req,res)=>{
   
})



app.get("/students",async (req,res)=>{
    console.log(`GET /students requested`)
    try{
        const strQry="SELECT * FROM students"
        const result = await database.query(strQry)
        return res.status(200).json(result.rows)
    }
    catch(err){
        return res.status(500).json({
            meesage:err.message
        })
    }
})

app.get('/',(req,res)=>{
    console.log(`GET / is Request.`)
    res.status(200).json({
        message:"ok"
    })
})



app.listen(port,()=>{
    console.log(`Server is Listen on PORT: ${port}`)
})