const express=require("express");
const cartRoutes=express.Router();
const cartOps=require("../database/helpers/cartCrud");

cartRoutes.post("/add",(req,res)=>{
cartOps.addToCart(req.body,res);
});
cartRoutes.post("/remove",(req,res)=>{
    cartOps.removeFromCart(req.body,res);
});
cartRoutes.post("/fetch",(req,res)=>{
    cartOps.fetchCart(req.body,res);
});

module.exports=cartRoutes;