const jsonWebToken=require("jsonwebtoken");
const tokenOps={
    SECRETKEY:"NotYourConcern",
    generateToken(username){
        return jsonWebToken.sign({username:username},this.SECRETKEY,{expiresIn:"5h", algorithm: 'HS256'});
    },
    verifyToken(clientToken){
        // var decoded=jsonWebToken.verify(clientToken,this.SECRETKEY);
        // if(decoded){console.log(decoded.username);
        //     return decoded.username;
        // }
        // else return null;
        try {
            var decoded = jsonWebToken.verify(clientToken, this.SECRETKEY);
            if(decoded) {
                //console.log(decoded.username);
                return decoded.username;
            }
        } catch(err) {
            //console.log(err);
            return null;
        }
    }
}
module.exports=tokenOps;