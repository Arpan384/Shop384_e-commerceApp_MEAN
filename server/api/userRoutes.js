const express=require("express");
const userRoutes=express.Router();
const userOps=require("../database/helpers/userCrud");

userRoutes.get("/master",(req,res)=>{
    userOps.findMaster(res);
});
userRoutes.get("/admin",(req,res)=>{
    userOps.fetchAdmins(res);
});
userRoutes.post("/master",(req,res)=>{
    userOps.registerMaster(req.body,res);
});
userRoutes.post("/login",(req,res)=>{
    userOps.loginUser(req.body,res);
});
userRoutes.post("/admin",(req,res)=>{
    userOps.registerAdmin(req.body,res);
});
userRoutes.post("/other",(req,res)=>{
    userOps.registerOther(req.body,res);
});
userRoutes.post("/update",(req,res)=>{
    userOps.updateUser(req.body,res);
});
userRoutes.post("/deladmin",(req,res)=>{
    userOps.deleteAdmin(req.body,res);
});
userRoutes.post("/delother",(req,res)=>{
    userOps.deleteOther(req.body,res);
});
userRoutes.post("/fetch",(req,res)=>{
    userOps.fetch(req.body,res);
});

module.exports=userRoutes;