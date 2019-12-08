const mongoose=require("mongoose");
const db=require("./config");
mongoose.connect(db.url);
module.exports=mongoose;