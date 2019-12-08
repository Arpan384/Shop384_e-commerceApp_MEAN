const express=require("express");
const productRoutes=express.Router();
const productOps=require("../database/helpers/productCrud");

productRoutes.get("/fetchall",(req,res)=>{
    productOps.fetchAll(res);
});
productRoutes.get("/fetchhome",(req,res)=>{
    productOps.fetchHome(res);
});
productRoutes.post("/fetch",(req,res)=>{
    productOps.fetch(req.body,res);
});
productRoutes.post("/delete",(req,res)=>{
    productOps.deleteProduct(req.body,res);
});
productRoutes.post("/update",(req,res)=>{
    productOps.updateProduct(req.body,res);
});
productRoutes.post("/updatemaster",(req,res)=>{
    productOps.updateProductMaster(req.body,res);
});
productRoutes.post("/create",(req,res)=>{
    //console.log(req.body)
    productOps.addProduct(req,res);
});
productRoutes.post("/single",(req,res)=>{
    productOps.addSingle(req.body,res);
});
productRoutes.post("/seller",(req,res)=>{
    productOps.fetchSeller(req.body,res);
});

module.exports=productRoutes;