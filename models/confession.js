var mongoose=require('mongoose');

 var confessionSchema=mongoose.model('confessions',new mongoose.Schema({
   msg:String,
   uname:String
 }));

 module.exports=confessionSchema;
