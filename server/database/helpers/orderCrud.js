const Order=require("../models/orderModel");
const User=require("../models/userModel");
const Product=require("../models/productModel");
const sendEmails=require("../../utils/nodemailer");
const jsonWebToken=require("../../utils/jsonwebtoken");

const orderOps={
    createOrder(req,res){
        if(req.token==undefined){
            res.status(404).json({"message":"Illegal action", "promptlogin":true});
        }
        else {
            var username=jsonWebToken.verifyToken(req.token); 
            if(username==null){
                res.status(404).json({"message":"Illegal action", "promptlogin":true});
                return;
            }
            User.findOne({username:username},(err,user)=>{
                if(err)res.status(500).json({"message":"Error in consumer find", "error":err});
                else{
                    if(user&&user.role=="consumer"){
                        Product.findOne({productid:req.order.productid},(err,prod)=>{
                            if(err)res.status(500).json({"message":"Error in product find", "error":err});
                            else {
                                if(prod){
                                    User.findOne({username:prod.sellerid},(err,seller)=>{
                                        if(err)res.status(500).json({"message":"Error in seller find", "error":err});
                                        else{
                                            if(seller){
                                                if(prod.quantity>=req.order.quantity){
                                                        var order={productid:prod.productid, sellerid:seller.username, consumerid:user.username, quantity:req.order.quantity, status:"Pending", amount:prod.price*req.order.quantity};
                                                        Order.create(order,(err)=>{
                                                            if(err)res.status(500).json({"message":"Cannot create order", "error":err});
                                                            else{
                                                                Product.updateOne({productid:prod.productid},{$set:{quantity:prod.quantity-req.order.quantity}},(err)=>{
                                                                    if(err)res.status(500).json({"message":"Cannot update product", "error":err});
                                                                });
                                                                sendEmails(`Order`,`Thank You for ordering ${req.order.quantity} ${prod.name} from ${seller.username}, please be patient and check back for updates.<br>COD Amount:${prod.price*req.order.quantity}`,user.email);
                                                                sendEmails(`Order`,`${user.username} ordered ${req.order.quantity} ${prod.name}:${prod.productid} from you, please update the details as necessary`,seller.email);
                                                                res.status(200).json({"message":"Order confirmed","success":true});
                                                            }
                                                        });
                                                }
                                                else{
                                                    sendEmails(`Apologies`,`Sorry, ${req.order.quantity} ${prod.name} is not available currently`,user.email);
                                                    sendEmails(`Request`,`Someone tried to order ${req.order.quantity} ${prod.name}:${prod.productid} which is currently insufficient in stock. Please restock it when availale`,seller.email);
                                                    res.status(200).json({"message":"Product unvavailable", "outofstock":true});
                                                }
                                            }
                                            else res.status(404).json({"message":"Unknown seller", "promptlogin":true});
                                        }
                                    });
                                }
                                else res.status(404).json({"message":"Unknown product", "promptlogin":true});
                            }
                        });
                    }
                    else res.status(404).json({"message":"Illegal action", "promptlogin":true});
                }
            });
        }
    },
    cancelOrder(req,res){
        if(req.token==undefined){
            res.status(404).json({"message":"Illegal action", "promptlogin":true});
        }
        else {
            var username=jsonWebToken.verifyToken(req.token); 
            if(username==null){
                res.status(404).json({"message":"Illegal action", "promptlogin":true});
                return;
            }
            User.findOne({username:username},(err,user)=>{
                if(err)res.status(500).json({"message":"Error in consumer find", "error":err});
                else{
                    if(user&&(user.role=="consumer"||user.role=="seller")){
                        var seller,consumer;
                        if(user.role=="consumer")consumer=user.email;
                        else seller=user.email;
                        Order.findOne({_id:req.orderid},(err,doc)=>{
                            if(err)res.status(500).json({"message":"Error in order find", "error":err});
                            else{
                                if(doc){
                                    var flag; 
                                    if(seller)flag=doc.consumerid; 
                                    else flag=doc.sellerid;
                                    User.findOne({username:flag},(err,flagged)=>{
                                        if(err)res.status(500).json({"message":"Cannot find flag user", "error":err});
                                        else{
                                            if(flagged){
                                                if(seller)consumer=flagged.email; else seller=flagged.email;
                                                Order.updateOne({_id:doc._id},{$set:{status:"Cancelled"}},(err)=>{
                                                    if(err)res.status(500).json({"message":"Error in order cancel", "error":err});
                                                    else{
                                                        Product.updateOne({productid:doc.productid},{$inc:{quantity:doc.quantity}},(err)=>{
                                                            if(err)res.status(500).json({"message":"Error in product update", "error":err});
                                                            else{
                                                                sendEmails("Order update",`Order for ${doc.productid} by ${doc.consumerid} has been cancelled.`,seller);
                                                                sendEmails("Order update",`Order for ${doc.productid} from ${doc.sellerid} has been cancelled.`,consumer);
                                                                res.status(200).json({"message":"Order cancelled", "success":true});
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                            else res.status(404).json({"message":"Flagged not found"});
                                        }
                                    });
                                }
                                else res.status(404).json({"message":"Order not found"});
                            }
                        });
                    }
                    else res.status(404).json({"message":"Illegal action", "promptlogin":true});
                }
            });
        }
    },
    updateOrder(req,res){
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
                if(err)res.status(500).json({"message":"Error in seller find", "error":err});
                else{
                    if(doc&&doc.role=="seller"){
                        Order.updateOne({_id:req.order.orderid},{$set:{status:req.order.status}},(err)=>{
                            if(err)res.status(500).json({"message":"Error in order update", "error":err});
                            else res.status(200).json({"message":"Order updated", "success":true});
                        });
                    }
                    else res.status(404).json({"message":"Illegal action", "promptlogin":true});
                }
            });
        }
    },
    fetch(req,res){
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
                if(err)res.status(500).json({"message":"Error in user fetch", "error":err});
                else {
                    if(doc){
                        if(doc.role=="consumer"){
                            Order.find({consumerid:username},(err,docs)=>{
                                if(err)res.status(500).json({"message":"Error in orders fetch", "error":err});
                                else res.status(200).json({"message":"Orders fetched", "orders":docs});
                            });
                        }
                        else if(doc.role=="seller"){
                            Order.find({sellerid:username},(err,docs)=>{
                                if(err)res.status(500).json({"message":"Error in orders fetch", "error":err});
                                else res.status(200).json({"message":"Orders fetched", "orders":docs});
                            });
                        }
                        else res.status(404).json({"message":"Illegal orders fetch", "promptlogin":true});
                    }
                    else res.status(404).json({"message":"User not found", "promptlogin":true});
                }
            });
        }
    }
}

module.exports=orderOps;