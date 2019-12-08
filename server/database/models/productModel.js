const connection=require("../connection");
const Schema=connection.Schema;
const productSchema=new Schema({
    'productid':{type:String, required:true, unique:true},
    "sellerid":{required:true, type:String},
    "quantity":{required:true, type:Number, default:0},
    "description":{type:String,default:""},
    "price":{required:true, type:Number, default:0},
    "name":{required:true, type:String},
    "picurl":{type:String,default:""},
    "deliverycharges":{type:Number,default:0},
    "homepage":{type:Boolean, default:false}
});
const Product=connection.model("products",productSchema);
module.exports=Product;

// integrate joi for validation