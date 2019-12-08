const connection=require("../connection");
const Schema=connection.Schema;
const roleRightSchema=new Schema({
    "role":{unique:true, required:true, type:String},
    "rights":{required:true, type:Array}
});
const RoleRights=connection.model("rolerights",roleRightSchema);
module.exports=RoleRights;