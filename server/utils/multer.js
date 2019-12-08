const multer=require("multer");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //console.log("Going to store the data in disk");
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        console.log("File name is: ",file.fieldname);
      cb(null, file.fieldname + '-' + Date.now()+".xlsx")
    }
});
module.exports=storage;