const Product=require("../models/productModel");
const User=require("../models/userModel");
const jsonWebToken=require("../../utils/jsonwebtoken");
const xlsxToJson=require("../../utils/xlsx-to-json");

const productOps={
    addProduct(req,res){console.log(req.body.token," ",req.file.filename);
        if(req.body.token==undefined){
            res.status(404).json({"message":"Illegal action", "promptlogin":true});
        }
        else {
            var username=jsonWebToken.verifyToken(req.body.token); 
            if(username==null){
                res.status(404).json({"message":"Illegal action", "promptlogin":true});
                return;
            }
            User.findOne({username:username},(err,doc)=>{
                if(err)res.status(500).json({"message":"Error in products", "error":err});
                else {
                    if(doc&&doc.role=="admin"){
                        xlsxToJson(req.file.filename,res,this.productHandler);
                    }
                    else res.status(404).json({"message":"Invalid admin", "promptlogin":true});
                }
            })
        }
    },
    updateProduct(req,res){
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
                if(err)res.status(500).json({"message":"Error in find seller", "error":err});
                else{
                    if(doc&&doc.role=="seller"){
                        Product.findOne({productid:req.product.productid},(err,doc1)=>{
                            if(err)res.status(500).json({"message":"Error in find product", "error":err});
                            else {
                                if(doc1&&doc1.sellerid==username){
                                    var qty=doc1.quantity,desc=doc1.description,pic=doc1.picurl,name=doc1.name,delc=doc1.deliverycharges,cost=doc1.price;
                                    if(req.product.quantity)qty=req.product.quantity;
                                    if(req.product.description)desc=req.product.description;
                                    if(req.product.price)cost=req.product.price;
                                    if(req.product.name)name=req.product.name;
                                    if(req.product.picurl)pic=req.product.picurl;
                                    if(req.product.deliverycharges)delc=req.product.deliverycharges;
                                    Product.updateOne({productid:req.product.productid},{$set:{quantity:qty,description:desc,price:cost,name:name,picurl:pic,deliverycharges:delc}},(err)=>{
                                        if(err)res.status(500).json({"message":"Error in product update", "error":err});
                                        else res.status(200).json({"message":"Product update successful"});
                                    });
                                }
                                else res.status(404).json({"message":"Invalid product"});
                            }
                        });
                    }
                    else res.status(404).json({"message":"Invalid seller", "promptlogin":true});
                }
            });
        }
    },
    updateProductMaster(req,res){
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
                if(err)res.status(500).json({"message":"Error in find master", "error":err});
                else{
                    if(doc&&doc.role=="master"){
                        Product.updateOne({productid:req.product.productid},{$set:{homepage:req.product.homepage}},(err)=>{
                            if(err)res.status(500).json({"message":"Cannot update product", "error":err});
                            else res.status(200).json({"message":"Product update successful"});
                        });
                    }
                    else res.status(404).json({"message":"Invalid master", "promptlogin":true});
                }
            });
        }
    },
    deleteProduct(req,res){
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
                if(err)res.status(500).json({"message":"Error in products", "error":err});
                else {
                    if(doc&&doc.role=="admin"){
                        Product.deleteOne({productid:req.product.productid},(err)=>{
                            if(err)res.status(500).json({"message":"Cannot delete product", "error":err});
                            else res.status(200).json({"message":"Product deleted: "+req.product.productid});
                        });
                    }
                    else res.status(404).json({"message":"Invalid admin", "promptlogin":true});
                }
            })
        }
    },
    fetchHome(res){
        Product.find({homepage:true},(err,docs)=>{
            if(err)res.status(500).json({"message":"Cannot fetch products", "error":err});
            else {
                if(docs){
                    res.status(200).json({"message":"Products fetched","products":docs});
                }
                else res.status(404).json({"message":"No products found"});
            }
        });
    },
    fetchSeller(req,res){
        if(req.token==undefined){
            res.status(404).json({"message":"Illegal action", "promptlogin":true});
        }
        else {
            var username=jsonWebToken.verifyToken(req.token); 
            if(username==null){
                res.status(404).json({"message":"Illegal action", "promptlogin":true});
                return;
            }
            Product.find({sellerid:username},(err,docs)=>{
                if(err)res.status(500).json({"message":"Cannot fetch products", "error":err});
                else {
                    if(docs){
                        res.status(200).json({"message":"Products fetched","products":docs});
                    }
                    else res.status(404).json({"message":"No products found"});
                }
            });
        }
    },
    fetchAll(res){
        Product.find({},(err,docs)=>{
            if(err)res.status(500).json({"message":"Cannot fetch products", "error":err});
            else {
                if(docs){
                    res.status(200).json({"message":"Products fetched","products":docs});
                }
                else res.status(404).json({"message":"No products found"});
            }
        });
    },
    fetch(req,res){
        Product.findOne({productid:req.product.productid},(err,doc)=>{
            if(err)res.status(500).json({"message":"Cannot fetch product", "error":err});
            else {
                if(doc){
                    res.status(200).json({"message":"Product fetched","product":doc});
                }
                else res.status(404).json({"message":"Product not found"});
            }
        });
    },
    addSingle(req,res){
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
                if(err)res.status(500).json({"message":"Error in products", "error":err});
                else {
                    if(doc&&doc.role=="admin"){
                        Product.create(req.product,(err)=>{
                            if(err){
                                if(err.code==11000&&err.name=="ValidationError")res.status(500).json({"message":"Error in product add", "productconflict":true,"missingrequiredfield":true});
                                else if(err.name=="ValidationError")res.status(500).json({"message":"Error in product add", "missingrequiredfield":true});
                                else if(err.code==11000)res.status(500).json({"message":"Error in product add", "productconflict":true});
                                else res.status(500).json({"message":"Error during add product: ",err});

                            }
                            else res.status(200).json({"message":"Product add successful","success":true});
                        });
                    }
                    else res.status(404).json({"message":"Invalid admin", "promptlogin":true});
                }
            })
        }
    },
    productHandler(arr,res){
        arr.forEach(element => {
           for(key in element){
               if(element[key]=="")delete element[key];
               else if(key=="quantity"||key=="deliverycharges"||key=="price")element[key]=parseInt(element[key])
           } 
        });
        //console.log(arr);
        // res.status(200).json({"message":"All products added successfully", "success":true});
        // return;

        // Product.insertMany(arr,{ordered:false},(err)=>{
        //     if(err){
        //         // if(err.code==11000&&err.name=="ValidationError")res.status(500).json({"message":"Error in product add", "productconflict":true,"missingrequiredfield":true});
        //         // else if(err.name=="ValidationError")res.status(500).json({"message":"Error in product add", "missingrequiredfield":true});
        //         // else if(err.code==11000)res.status(500).json({"message":"Error in product add", "productconflict":true});
        //         // else 
        //         res.status(500).json({"message":"Error during add product: ",err});
        //     }
        //     else{
        //         res.status(200).json({"message":"All products added successfully", "success":true});
        //     }
        // });


        Product.insertMany(arr,(err)=>{
            if(err){
                res.status(500).json({"message":"Error during add product: ",err});
            }
            else{
                res.status(200).json({"message":"Products added successfully"});
            }
        });

        // var count= arr.length;
        // // for (i =0; i<count;i++){
        // //     prodAssist[i] = "DB Error"
        // // }
        // for(i=0;i<count;i++){
        //     Product.findOne({productid: arr[i]}, (err,doc)=>{
        //         if(err){
        //             prodAssist[i]="DB Error"
        //         }
        //         else{
        //             if(doc){
        //                 Product.create(arr[i],(err)=>{
        //                     if(err){
        //                         if(err.code==11000&&err.name=="ValidationError"){prodAssist[i]="Missing Required Fields and duplicate key"}
        //                         else if(err.name=="ValidationError"){prodAssist[i]="Missing Required Fields"}
        //                         else if(err.code==11000){prodAssist[i]="duplicate key"}
        //                         else { prodAssist[i]="Db error"}
        //                     }
        //                     else {
        //                         prodAssist[i] = "Insertion successful"
        //                     }
        //                 })
        //             }
        //         }
        //     })
        // }

        // var check=setInterval(()=>{
        //     console.log("call")
        //     keyLength= Object.keys(prodAssist).length
        //     if(keyLength==count){
        //         res.status(200).json({"data":prodAssist});
        //         console.log("hi",prodAssist)
        //         prodAssist={};
        //         clearInterval(check)
        //     }
        // },2000)
    }
}

var prodAssist={};

module.exports=productOps;  