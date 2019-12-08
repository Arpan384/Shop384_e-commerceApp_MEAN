const User=require("../models/userModel");
const roleRightsOps=require("../helpers/roleRightsCrud");
const Cart=require("../models/cartModel");
const Product=require("../models/productModel");
const Order=require("../models/orderModel")
const sendEmails=require("../../utils/nodemailer");
const jsonWebToken=require("../../utils/jsonwebtoken");
const bcrypt=require("../../utils/bcrypt");


const userOps={
    findMaster(res){
        User.findOne({role:"master"},(err,doc)=>{
            if(err){
                res.status(500).json({"message":"Error in user find operation"});
            }
            else{
                if(doc){
                    res.status(200).json({"message":"Master found", "promptNewMaster":false});
                }
                else {
                    res.status(200).json({"message":"No master found", "promptNewMaster":true});
                }
            }
        })
    },
    registerMaster(req,res){
        var user={username:"Master", password:bcrypt.encryptPassword("master123"), email:req.user.email, role:"master"};
        User.create(user,(err)=>{
            if(err){
                res.status(500).json({"message":"Error in master add"});
            }
            else{
                setTimeout(function(){
                    User.findOne({username:user.username},(err,doc)=>{
                        if(err){console.log("Error in db find");} //winston
                        else {
                            if(doc&&doc.firstTime){
                                User.deleteOne({username:doc.username},(err)=>{
                                    if(err)console.log("Error in delete user"); //winston
                                    else {
                                        roleRightsOps.degenerate();
                                        console.log("Master deleted"); //winston
                                        sendEmails("Account Dismantled",`<h3>Account verification for ${doc.username} failed and it has been dismantled</h3>`,doc.email);
                                    }
                                });
                            }
                            else console.log(req.user.username+" does not exist"); //winston
                        }
                    });
                },1000*60*60*24);
                sendEmails("Welcome Master","<h4>Congrats for your new website!!</h4><h5>Hope your business prospers well :D</h5><p>Here is the <a href='http:\/\/localhost:5500\/'>link</a> to get started. </p><p>Username:'Master', Password:'Master123'</p><br>Please login within 24 hours to verify else the account would be dismantled",req.user.email,res,roleRightsOps.generate);
            }
        });
    },
    loginUser(req,res){
        User.findOne({username:req.user.username},(err,doc)=>{
            if(err)res.status(500).json({"message":"Login error"});
            else if(doc){
                if(bcrypt.compareHash(req.user.password,doc.password)){
                    var token=jsonWebToken.generateToken(doc.username);
                    if(doc.firstTime){
                        User.updateOne({username:doc.username},{$set:{"firstTime":false}},(err)=>{
                            if(err)console.log("Error in firstTime update: ",doc.username); //winston
                            else console.log("Updated firstTime false: ",doc.username); //winston
                        })
                    }
                    res.status(200).json({"message":"Credentials verified", "profile":doc, "token":token});
                }
                else {
                    res.status(404).json({"message":"Invalid username or password", "invalid":true});
                }
            }
            else {
                res.status(404).json({"message":"Invalid username or password", "invalid":true});
            }
        });
    },
    registerAdmin(req,res){
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
                if(err){
                    res.status(500).json({"message":"Master find error", "promptlogin":true});
                }
                else {
                    if(doc&&doc.role=="master"){
                        var user={username:req.user.username, password:bcrypt.encryptPassword(req.user.password), email:req.user.email, role:"admin"};
                        User.create(user,(err)=>{
                            if(err){
                                if(err.code==11000)res.status(500).json({"message":"Error in admin add", "userconflict":true});
                                else res.status(500).json({"message":"Error in admin add", error:err});
                            }
                            else {
                                setTimeout(function(){
                                    User.findOne({username:req.user.username},(err,doc)=>{
                                        if(err){console.log("Error in db find");} //winston
                                        else {
                                            if(doc&&doc.firstTime){
                                                User.deleteOne({username:doc.username},(err)=>{
                                                    if(err)console.log("Error in delete admin"); //winston
                                                    else {
                                                        sendEmails("Account Dismantled",`<h3>Account verification for ${doc.username} failed and it has been dismantled</h3>`,doc.email);
                                                        console.log("Admin deleted: "+doc.username); //winston
                                                    }
                                                })
                                            }
                                            else console.log(req.user.username+" does not exist"); //winston
                                        }
                                    });
                                },1000*60*60*24);
                                sendEmails("Welcome Aboard",`<h4>Congrats for being hired as our new Admin!!</h4><h5>Hope you enjoy your journey with us :)</h5><p>Here is the <a href='http:\/\/localhost:5500\/'>link</a> to get started. </p><p>Username:\'${req.user.username}\', Password:\'${req.user.password}\'</p><br>Please login within 24 hours to verify else the account would be dismantled`,req.user.email,res);
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
    registerOther(req,res){
        var user={username:req.user.username,password:bcrypt.encryptPassword(req.user.password),email:req.user.email,role:req.user.role};
        User.create(user,(err)=>{
            if(err){
                if(err.code==11000)res.status(500).json({"message":"Error in user add", "userconflict":true});
                else res.status(500).json({"message":"Error in user add", error:err});
            }
            else {
                var message;
                if(req.user.role=="consumer")message=`<h4>Thank you for registering with us!!</h4><h5>Hope you enjoy shopping with us :)</h5><p>Here is the <a href='http:\/\/localhost:5500\/'>link</a> to get started. </p><p>Username:\'${req.user.username}\', Password:\'${req.user.password}\'</p><br>Please login within 24 hours to verify else the account would be dismantled`;
                else message=`<h4>Thank you for registering with us!!</h4><h5>Hope you prosper in your business with us :)</h5><p>Here is the <a href='http:\/\/localhost:5500\/'>link</a> to get started. </p><p>Username:\'${req.user.username}\', Password:\'${req.user.password}\'</p><br>Please login within 24 hours to verify else the account would be dismantled`;
                setTimeout(function(){
                    User.findOne({username:req.user.username},(err,doc)=>{
                        if(err){console.log("Error in db find");} //winston
                        else {
                            if(doc&&doc.firstTime){
                                User.deleteOne({username:doc.username},(err)=>{
                                    if(err)console.log("Error in delete user"); //winston
                                    else {
                                        sendEmails("Account Dismantled",`<h3>Account verification for ${doc.username} failed and it has been dismantled</h3>`,doc.email);
                                        console.log("User deleted: "+doc.username); //winston
                                    }
                                })
                            }
                            else console.log(req.user.username+" does not exist or is verified"); //winston
                        }
                    });
                },1000*60*60*24);
                sendEmails(`Welcome ${req.user.role}`,message,req.user.email,res);
                res.status(200).json({"message":"User registered successfully"});
            }
        });
    },
    updateUser(req,res){
        if(req.token==undefined){
            res.status(404).json({"message":"Illegal action", "promptlogin":true});
        }
        else {
            var username=jsonWebToken.verifyToken(req.token); 
            if(username==null){
                res.status(404).json({"message":"Illegal action", "promptlogin":true});
                return;
            }
            var password,email;
            if(req.user.password)password=req.user.password;
            if(req.user.email)email=req.user.email;
            User.findOne({username:username},(err,doc)=>{
                if(err)res.status(500).json({"message":"User search failed", "error":err});
                else{
                    if(doc){
                        if(password==undefined)password=doc.password;
                        if(email==undefined)email=doc.email;
                        User.updateOne({username:username},{$set:{"password":bcrypt.encryptPassword(req.user.password),"email":req.user.email}},(err)=>{
                            if(err)res.status(500).json({"message":"User updation failed", "error":err});
                            else res.status(200).json({"message":"User updated"});
                        });
                    }
                    else res.status(404).json({"message":"Illegal action", "promptlogin":true});
                }
            })
        }
    },
    deleteAdmin(req,res){
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
                if(err){
                    res.status(500).json({"message":"Master find error", "promptlogin":true});
                }
                else {
                    if(doc&&doc.role=="master"){
                        User.deleteOne({username:req.user.username},(err)=>{
                            if(err)res.status(500).json({"message":"Admin deletion failed","error":err});
                            else res.status(200).json({"message":"Admin deleted: "+req.user.username});
                        });
                    }
                    else{
                        res.status(404).json({"message":"Illegal action", "promptlogin":true});
                    }
                }
            });
        }
    },
    deleteOther(req,res){
        if(req.token==undefined){
            res.status(404).json({"message":"Illegal action", "promptlogin":true});
        }
        else {
            var username=jsonWebToken.verifyToken(req.token); 
            if(username==null){
                res.status(404).json({"message":"Illegal action", "promptlogin":true});
                return;
            }
            Order.findOne({$or:[{consumerid:username},{sellerid:username}], status:{$nin:["Delivered","Cancelled"]}},(err,doc)=>{
                if(err)res.status(500).json({"message":"User find error", "promptlogin":true});
                else{
                    if(doc){
                        res.status(403).json({"message":"User has pending orders and cannot be deleted", "delete":false});
                    }
                    else {
                        User.deleteOne({$or:[{username:username, role:"seller"},{username:username, role:"consumer"}]},(err)=>{
                            if(err)res.status(500).json({"message":"User deletion failed", "error":err});
                            else {
                                Cart.deleteOne({consumerid:username},(err)=>{
                                    if(err)res.status(500).json({"message":"Error in products delete", "error":err});
                                    else {
                                        Product.deleteMany({sellerid:username},(err)=>{
                                            if(err)res.status(500).json({"message":"Error in products delete", "error":err});
                                            else {
                                                Order.deleteMany({$or:[{consumerid:username},{sellerid:username}]},(err)=>{
                                                    if(err)res.status(500).json({"message":"Error in orders delete", "error":err});
                                                    else res.status(200).json({"message":"User, orders and cart/products deleted: "+username+" or invalid Account"});
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
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
                res.status(404).json({"message":"Illegal login", "promptlogin":true});
                return;
            }
            User.findOne({username:username},(err,doc)=>{
                if(err)res.status(500).json({"message":"User fetch failed", "error":err});
                else {
                    if(doc){
                        res.status(200).json({"message":"User fetch successful", "profile":doc});
                    }
                    else {
                        res.status(404).json({"message":"User not found during fetch", "promptlogin":true});
                    }
                }
            });
        }
    },
    fetchAdmins(res){
        User.find({role:"admin"},(err,docs)=>{
            if(err)res.status(500).json({"message":"Admins fetch failed", "error":err});
            else{
                res.status(200).json({"message":"Admins fetch successful", "admins":docs});
            }
        })
    }
}

module.exports=userOps;