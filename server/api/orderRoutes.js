const express=require("express");
const orderRoutes=express.Router();
const orderOps=require("../database/helpers/orderCrud");

orderRoutes.post("/create",(req,res)=>{
    orderOps.createOrder(req.body,res);
});
orderRoutes.post("/cancel",(req,res)=>{
    orderOps.cancelOrder(req.body,res);
});
orderRoutes.post("/update",(req,res)=>{
    orderOps.updateOrder(req.body,res);
});
orderRoutes.post("/fetch",(req,res)=>{
    orderOps.fetch(req.body,res);
});

module.exports=orderRoutes;