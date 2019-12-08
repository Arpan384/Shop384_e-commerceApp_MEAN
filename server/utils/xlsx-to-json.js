const xlsxToJson=require("xlsx-to-json");

module.exports=(input,res,cb)=>{
    xlsxToJson({
        input: "uploads/"+input, 
        output: null
        }, function(err, result) {
        if(err) {
            res.status(500).json({"msg":"file convert err..."});
        }else {
            if(cb){cb(result,res);}
            else res.status(200).json({"msg":"file converted"});
        }
        }
    );
}