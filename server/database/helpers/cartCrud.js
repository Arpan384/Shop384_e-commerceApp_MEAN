const Cart=require("../models/cartModel");
const User=require("../models/userModel");
const Product=require("../models/productModel");
const jsonWebToken=require("../../utils/jsonwebtoken");

const cartOps={
    addToCart(req,res){
        if(req.token==undefined){
            res.status(404).json({"message":"Illegal action", "promptlogin":true});
        }
        else {
            var username=jsonWebToken.verifyToken(req.token); 
            if(username==null){
                res.status(404).json({"message":"Illegal action", "promptlogin":true});
                return;
            }
            User.findOne({username:username},(err,doc)=>{
                if(err)res.status(500).json({"message":"Fetch consumer failed", "error":err});
                else{
                    if(doc&&doc.role=="consumer"){
                        Cart.findOne({consumerid:username},(err,doc1)=>{
                            if(err)res.status(500).json({"message":"Fetch cart failed", "error":err});
                            else{
                                if(doc1){
                                    if(doc1.cartitems.indexOf(req.productid)>=0)res.status(200).json({"message":"Item already in  cart"});
                                    else{
                                        Cart.updateOne({consumerid:username},{$push:{cartitems:req.productid}},(err)=>{
                                            if(err)res.status(500).json({"message":"Update cart failed", "error":err});
                                            else res.status(200).json({"message":"Cart updated"});
                                        });
                                    }
                                }
                                else {
                                    var new_cart=[req.productid];
                                    Cart.create({consumerid:username, cartitems:new_cart},(err)=>{
                                        if(err)res.status(500).json({"message":"Cart creation failed", "error":err});
                                        else res.status(200).json({"message":"Cart created"});
                                    });
                                }
                            }
                        });
                    }
                    else{
                        res.status(404).json({"message":"Illegal action", "promptlogin":true});
                    }
                }
            });
        }
    },
    removeFromCart(req,res){
        if(req.token==undefined){
            res.status(404).json({"message":"Illegal action", "promptlogin":true});
        }
        else {
            var username=jsonWebToken.verifyToken(req.token); 
            if(username==null){
                res.status(404).json({"message":"Illegal action", "promptlogin":true});
                return;
            }
            Cart.findOne({consumerid:username},(err,doc)=>{
                if(err)res.status(500).json({"message":"Fetch cart failed", "error":err});
                else{
                    if(doc){
                        //var new_cart=doc1.cartitems.filter(e=>{if(e!=req.productid)return true});
                        Cart.updateOne({consumerid:username},{$pull:{cartitems:req.productid}},(err)=>{
                            if(err)res.status(500).json({"message":"Update cart failed", "error":err});
                            else res.status(200).json({"message":"Cart updated"});
                        });
                    }
                    else{
                        res.status(404).json({"message":"Cart not found"});
                    }
                }
            });
        }

    },
    fetchCart(req,res){
        if(req.token==undefined){
            res.status(404).json({"message":"Illegal action", "promptlogin":true});
        }
        else {
            var username=jsonWebToken.verifyToken(req.token); 
            if(username==null){
                res.status(404).json({"message":"Illegal action", "promptlogin":true});
                return;
            }
            Cart.findOne({consumerid:username},(err,doc)=>{
                if(err)res.status(500).json({"message":"Cannot fetch cart", "error":err});
                else{
                    if(doc){
                       var prodArr=[]; var delCount=0;
                       doc.cartitems.forEach(element => {
                           Product.findOne({productid:element},(err,doc1)=>{
                            if(err)res.status(500).json({"message":"Cannot fetch product", "error":err});
                            else {
                                if(doc1)prodArr.push(doc1);
                                else{
                                    Cart.updateOne({consumerid:username},{$pull:{cartitems:element}},(err)=>{
                                        if(err)res.status(500).json({"message":"Update cart failed", "error":err});
                                        else delCount++;
                                    });
                                }
                            }
                           });
                       });
                       var intCount=0;
                       var sender=setInterval(()=>{intCount+=1;
                           if(doc.cartitems.length==prodArr.length+delCount){
                               res.status(200).json({"message":"Cart and products fetched","cartitems":prodArr});
                               if(intCount==5)res.status(200).json({"message":"Cart and products partially fetched","cartitems":prodArr});
                               clearInterval(sender);
                           }
                       },2000,intCount);
                    }
                    else{
                        res.status(404).json({"message":"Cart not found"});
                    }
                }
            });
        }
    }
}
module.exports=cartOps;