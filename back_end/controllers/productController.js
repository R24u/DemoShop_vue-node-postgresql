import database from "../services/database.js";
import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'img_pd')
    },
    filename: function (req, file, cb) {
        cb(null, `${req.params.id}.jpg`)
    }
})
const upload = multer({ storage }).single('image')

export async function uploadProductImg(req, res) {
    upload(req, res, (err) => {
        if (err) return res.status(400).json({ message: err.message })
        res.status(200).json({ message: 'upload success' })
    })
}

export async function getProductById(req,res) {
    console.log(`GET /getProductById req`)
    try{
        const result = await database.query({
            text:`SELECT p.*,
                        (
                            SELECT row_to_json(brand_obj)
                            FROM (SELECT * FROM brands
                                WHERE "brandId" = p."brandId"
                                )brand_obj
                        ) AS brand,

                        (
                            SELECT row_to_json(pdt_obj)
                            FROM (SELECT * FROM "pdTypes"
                                WHERE "pdTypeId" = p."pdTypeId"
                                )pdt_obj
                        ) AS pdt

                        FROM products p
                        WHERE p."pdId" = $1`,
            values:[req.params.id]
        })


        return res.status(200).json(result.rows)
    }
    catch(err){
        return res.status(500).json({
            message:err.message
        })
    }
}

export async function getAllProduct(req,res) {
    console.log(`GET /products req`)
    try{
        const strQry = `SELECT p.*,
                        (
                            SELECT row_to_json(brand_obj)
                            FROM (SELECT * FROM brands
                                WHERE "brandId" = p."brandId"
                                )brand_obj
                        ) AS brand,

                        (
                            SELECT row_to_json(pdt_obj)
                            FROM (SELECT * FROM "pdTypes"
                                WHERE "pdTypeId" = p."pdTypeId"
                                )pdt_obj
                        ) AS pdt

                        FROM products p`;
        const result= await database.query(strQry)
        return res.status(200).json(result.rows)
    }
    catch(err){
        return res.status(500).json({
            message:err.message
        })
    }
}

export async function getThreeProduct(req,res) {
    console.log(`GET / Threeproducts req`)
    try{
        const strQry = `SELECT p.*,
                        (
                            SELECT row_to_json(brand_obj)
                            FROM (SELECT * FROM brands
                                WHERE "brandId" = p."brandId"
                                )brand_obj
                        ) AS brand,

                        (
                            SELECT row_to_json(pdt_obj)
                            FROM (SELECT * FROM "pdTypes"
                                WHERE "pdTypeId" = p."pdTypeId"
                                )pdt_obj
                        ) AS pdt

                        FROM products p
                        OFFSET 0 LIMIT 3`;
        const result= await database.query(strQry)
        return res.status(200).json(result.rows)
    }
    catch(err){
        return res.status(500).json({
            message:err.message
        })
    }
}



export async function postProduct(req,res) {
    console.log(`POST /Products is Request`)
    const bodyData=req.body
    console.log(bodyData)
    
    try{
        if(!bodyData.pdId || !bodyData.pdName)
        {
                return res.status(422).json({message:`ERROR pdId and pdName is req `})
        }

        const chkRow = await database.query({
            text:`SELECT * FROM products WHERE "pdId"=$1`,
            values:[req.body.pdId]
        })

        if (chkRow.rowCount!=0){
            return res.status(409).json({meesage:`ERROR pdId ${bodyData.pdId} is exit`})

        }

        const result = await database.query({
            text:`
            INSERT INTO Products (
                "pdId",
                "pdName",
                "pdPrice",
                "pdTypeId",
                "brandId"
                )
                VALUES ($1,$2,$3,$4,$5)
                `,
                values:[
                    req.body.pdId,
                    req.body.pdName,
                    req.body.pdPrice,
                    req.body.pdTypeId,
                    req.body.brandId
                ]
            })
            bodyData.datetime = new Date()
            res.status(201).json(bodyData)

    }
    catch(err){
        return res.status(500).json({
            message:err.meesage
        })
    }   
}

export async function putProduct(req,res) { 
    console.log (`PUT /Products is req`);   
    try{
        const bodyData=req.body
        const result = await database.query({
            text:`UPDATE "products"
                  SET "pdName" = $1,
                      "pdPrice" = $2,
                      "pdRemark" = $3,  
                      "pdTypeId" = $4,
                      "brandId" = $5
                  WHERE "pdId" = $6
                `,
            values:[
                bodyData.pdName,
                bodyData.pdPrice,
                bodyData.pdRemark,
                bodyData.pdTypeId,
                bodyData.brandId,
                req.params.id
            ]
        })
        if(result.rowCount==0)
            return res.status(404).json({message:`ERROR id ${req.params.id} not found`})
        const datetime = new Date()
        bodyData.updateDate=datetime
        bodyData.message = "update success"
        return res.status(201).json(bodyData)
    }
    catch(err){
        return res.status(500).json({message:err.message})
    }
}

export async function deleteProduct(req,res) {
    console.log (`delete /Products ${req.params.id}is req`);
    try{
        const bodyData=req.body
        const result = await database.query({
            text:`DELETE FROM "products"
                  WHERE "pdId" = $1
                `,
            values:[
                req.params.id
            ]
        })
        if(result.rowCount==0)
            return res.status(404).json({message:`ERROR id ${req.params.id} not found`})
        return res.status(204).end()
    }
    catch(err){
        return res.status(500).json({meesage:err.meesage})
    }
}

export async function getProductByBrandId(req,res) {
    console.log(`GET /getProductByBrandId ${req.params.id} req`);
    try{
        const result = await database.query({
            text:`SELECT p.*,
                        (
                            SELECT row_to_json(brand_obj)
                            FROM (SELECT * FROM brands
                                WHERE "brandId" = p."brandId"
                                )brand_obj
                        ) AS brand,

                        (
                            SELECT row_to_json(pdt_obj)
                            FROM (SELECT * FROM "pdTypes"
                                WHERE "pdTypeId" = p."pdTypeId"
                                )pdt_obj
                        ) AS pdt

                        FROM products p
                        WHERE p."brandId" ILIKE $1`,
            values:[req.params.id]
        })


        return res.status(200).json(result.rows)
    }
    catch(err){
        return res.status(500).json({
            message:err.message
        })
    }
}

export async function getPopularProducts(req, res) {
    console.log(`GET /products/popular req`)
    try {
        const result = await database.query(`
            SELECT p.*,
                   COALESCE(SUM(ctd.qty), 0) AS "totalQty",
                   (
                       SELECT row_to_json(brand_obj)
                       FROM (SELECT * FROM brands WHERE "brandId" = p."brandId") brand_obj
                   ) AS brand
            FROM products p
            LEFT JOIN "cartDtl" ctd ON p."pdId" = ctd."pdId"
            GROUP BY p."pdId"
            ORDER BY "totalQty" DESC
            LIMIT 3
        `)
        return res.status(200).json(result.rows)
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

export async function getSearchProduct(req,res) {
    console.log(`GET /getSearch stext=${req.params.id}is req`)
    try{
        const result = await database.query({
            text:`SELECT p.*,
                        (
                            SELECT row_to_json(brand_obj)
                            FROM (SELECT * FROM brands
                                WHERE "brandId" = p."brandId"
                                )brand_obj
                        ) AS brand,

                        (
                            SELECT row_to_json(pdt_obj)
                            FROM (SELECT * FROM "pdTypes"
                                WHERE "pdTypeId" = p."pdTypeId"
                                )pdt_obj
                        ) AS pdt

                        FROM products p
                        WHERE p."pdId" ILIKE $1
                            OR p."pdName" ILIKE $1
                            OR p."pdRemark" ILIKE $1
                        `,
            values:[`%${req.params.id}%`]
        })


        return res.status(200).json(result.rows)
    }
    catch(err){
        return res.status(500).json({
            message:err.message
        })
    }
}