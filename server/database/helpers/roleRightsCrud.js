const roleRights=require("../models/roleRightsModel");
var mongoose = require('mongoose');
const master={role:"master", rights:["add admin","delete admin","update product"]};
const admin={role:"admin", rights:["add product","delete product"]};
const consumer={role:"consumer", rights:["add order","delete order","add cart","delete cart"]};
const seller={role:"seller", rights:["update product","update order"]};

const roleRightsOps={
    generate(res){
        roleRights.create(master,(err)=>{
            if(err){
                this.degenerate(res);
                //res.status(500).json({"message":"Master roleRight creation error"});
            }
        });
       roleRights.create(admin,(err)=>{
           if(err){
                this.degenerate(res);
               //res.status(500).json({"message":"Admin roleRight creation error"});
           }
       });
       roleRights.create(consumer,(err)=>{
            if(err){
                this.degenerate(res);
                //res.status(500).json({"message":"Consumer roleRight creation error"});
            }
        });
        roleRights.create(seller,(err)=>{
            if(err){
                this.degenerate(res);
                //res.status(500).json({"message":"Seller roleRight creation error"});
            }
        });
        res.status(200).json({"message":"Master and roleRights generated", "success":true});
    },
    degenerate(res){
        roleRights.remove({},(err)=>{
            if(err){
                if(res)res.status(500).json({"message":"roleRights rollback error"});
                else console.log("Role rights degeneration failed"); //winston
            }
            else {
                if(res)res.status(500).json({"message":"roleRights generation error"});
                else console.log("Role rights degenerated as admin verification failed"); //winston
            }
        });
    }
}
module.exports=roleRightsOps;