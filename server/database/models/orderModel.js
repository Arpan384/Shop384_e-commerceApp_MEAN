const connection=require("../connection");
const Schema=connection.Schema;
const orderSchema=new Schema({
    "productid":{required:true, type:String},
    "sellerid":{required:true, type:String},
    "consumerid":{required:true, type:String},
    "quantity":{required:true, default:0, type:Number},
    "amount":{required:true, type:Number},
    "status":{required:true, type:String, default:"Pending", $in: [ "Pending", "Dispatched", "Delivered", "Cancelled" ]}
});
const Order=connection.model("orders",orderSchema);
module.exports=Order;