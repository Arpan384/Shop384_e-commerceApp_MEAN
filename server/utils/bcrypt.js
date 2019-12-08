const bcrypt=require("bcrypt");
const encryptOps={
    salt:10,
    encryptPassword(password){
        return bcrypt.hashSync(password,this.salt);
    },
    compareHash(password,hashPassword){
        return bcrypt.compareSync(password,hashPassword);
    }
}
module.exports=encryptOps;