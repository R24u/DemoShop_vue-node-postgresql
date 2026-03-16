import database from "../services/database.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import multer from "multer"

// ไว้ก่อน export
// upload part
// 1. การกำหนดค่า storage (พื้นที่จัดเก็บไฟล์)
const storage = multer.diskStorage({
    // destination: กำหนดโฟลเดอร์ปลายทางที่จะเก็บไฟล์
    destination: function (req, file, cb) {
        // cb = callback function
        // cb(null, 'img_mem') หมายถึง: ไม่มี error (null) และให้เก็บไฟล์ในโฟลเดอร์ 'img_mem'
        cb(null, 'img_mem')
    },
   
    // filename: กำหนดชื่อไฟล์ที่จะบันทึก
    filename: function (req, file, cb) {
        // req.body.memEmail คือการดึงค่า email จาก form data ที่ส่งมา
        // ตัวอย่าง: ถ้า memEmail = "test@gmail.com" ไฟล์จะถูกบันทึกเป็น "test@gmail.com.jpg"
        const filename = `${req.body.memEmail}.jpg`
        // กำหนดชื่อไฟล์ผ่าน callback
        cb(null, filename)
    }
})

// 2. การกำหนดค่า uploader
const upload = multer({
    storage: storage,  // ใช้ storage configuration ที่กำหนดไว้
}).single('file');    
// single('file') หมายถึงรับอัปโหลดไฟล์เดียว และ field name ใน form ต้องชื่อ 'file'



export async function uploadImg(req, res) {
    //3.Method ที่ให้ Frontend เรียกใช้
   console.log("Upload Member Image")
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        res.status(200).json({ message: 'File uploaded successfully!' });
    });
}

export async function postMember(req, res) {
    console.log(`POST /Member is Request`)
    console.log(req.body) // ✅ was: console.log(bodyData)

    try {
        // ✅ was: bodyData.memEmail / bodyData.memName
        if (!req.body.memEmail || !req.body.memName) {
            return res.json({ message: `ERROR memEmail and memName is req`, regist: false })
        }

        const chkRow = await database.query({
            text: `SELECT * FROM members WHERE "memEmail"=$1`,
            values: [req.body.memEmail] // ✅ was: req.body.pdId
        })

        if (chkRow.rowCount != 0) {
            // ✅ was: bodyData.memEmail / typo "meesage"
            return res.json({ message: `ERROR memEmail ${req.body.memEmail} is exit`, regist: false })
        }

        const pwd = req.body.password
        const saltround = 11
        const pwdHash = await bcrypt.hash(pwd, saltround)

        const result = await database.query({
            text: `
                INSERT INTO "members"(
                    "memEmail",
                    "memName",
                    "memHash"
                )
                VALUES ($1,$2,$3)
            `,
            values: [
                req.body.memEmail,
                req.body.memName,
                pwdHash
            ]
        })

        res.json({ // ✅ was: mutating undefined bodyData
            datetime: new Date(),
            message: "Regist Success", // ✅ was: "meesage"
            regist: true
        })

    } catch (err) {
        return res.json({
            message: err.message, // ✅ was: err.meesage
            regist: false
        })
    }
}

export async function loginMember(req,res) {
    console.log(`POST /LoginMember is Request`)
    const bodyData=req.body
    
    try{
        if(!bodyData.loginName || !bodyData.password)
        {
            return res.json({message:`ERROR LoginName and Password is req `})
        }

        const result = await database.query({
            text:`SELECT * FROM members WHERE "memEmail"=$1`,
            values:[req.body.loginName]
        })

        if (result.rowCount == 0){
            return res.json({message:`Login Fail`,login:false})

        }

        const loginOK=await bcrypt.compare(req.body.password,result.rows[0].memHash)
        
        if(loginOK){
            const theuser={
                memEmail:result.rows[0].memEmail,
                memName:result.rows[0].memName,
                dutyId:result.rows[0].dutyId
            }
            const secret_key=process.env.SECRET_KEY //อ่านค่าจาก ENV
            const token = jwt.sign(theuser,secret_key,{expiresIn:'1h'}) //สร้าง Token
            // สร้าง Cookie
            res.cookie('token',token,{
                maxAge:3600000, //3,600,000 ms --> 60 minute -->1hr,
                httpOnly: true, // ป้องกันการเข้าถึง Token ผ่าน JavaScript (ป้องกัน XSS)
                secure: true,
                sameSite:'strict' // ป้องกันส่ง Cookie ข้าม Domain
            })
            return res.json({message: `Login Success`,login:true})
        }
        else{
            res.clearCookie('token',token,{
                maxAge:3600000, //3,600,000 ms --> 60 minute -->1hr,
                httpOnly: true, // ป้องกันการเข้าถึง Token ผ่าน JavaScript (ป้องกัน XSS)
                secure: true,
                sameSite:'strict' // ป้องกันส่ง Cookie ข้าม Domain
            })
            return res.json({message: `Login fail`,login:false})
        }
    }
    catch(err){
        return res.json({
            message:err.meesage
        })
    }   
}

export async function getMember(req,res) {
    console.log(`GET /getMember is req`)
    const token = req.cookies.token
    if(!token)
        return res.json({ message: `NO Member`,Login: false})
    try{
        const secret_key = process.env.SECRET_KEY
        const member = jwt.verify(token, secret_key)
        console.log(member)
        return res.json({
            memEmail: member.memEmail,
            memName: member.memName,
            dutyid: member.dutyId,
            login:true
        })
    }
    catch (err){
        console.log(err.message)
        return res.json({ message: `The Information was false   `,login:false})
    }
    
}

export async function logoutMember(req, res) {
    console.log(`GET /logoutMember is req`)
    try{
        res.clearCookie('token', { path: '/' })
        res.json({ message: `Logout Success`, login: false })
    }
    catch (err){
        return res.json({
            message: err.message
        })
    }
}