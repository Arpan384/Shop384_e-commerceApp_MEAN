const express=require("express");
const app=express();
const bodyParser=require("body-parser");
const multer=require("multer");
const storage=require("./utils/multer");

app.use(require("./utils/cors"));
app.use( multer({ storage: storage }).single("file"));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use("/user",require("./api/userRoutes"));
app.use("/cart",require("./api/cartRoutes"));
app.use("/product",require("./api/productRoutes"));
app.use("/order",require("./api/orderRoutes"));

app.listen(process.env.PORT||1234,(err)=>{
    if(err){
        console.log("Can't start server");
    }
    else {
        console.log("Server start @1234");
    }
});