const connection=require("../connection");
const Schema=connection.Schema;
const cartSchema=new Schema({
    "consumerid":{required:true, unique:true, type:"String"},
    "cartitems":{type:Array}
});
const Cart=connection.model("carts",cartSchema);
module.exports=Cart;