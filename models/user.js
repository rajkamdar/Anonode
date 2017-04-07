var mongoose=require('mongoose');
var bcrypt=require('bcrypt');
var userSchema=mongoose.model('users',new mongoose.Schema({
  name:String,
  uname:{type: String,unique:true},
  pwd:String,
  img:String
}));

module.exports=userSchema;

module.exports.encrypt = function(password,fn){
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
        fn(hash);
    });
  });

}

module.exports.comparePassword = function(candidatePassword, hash, fn){
	bcrypt.compare(candidatePassword, hash, function(err,res) {
    	if(err) throw err;
    	fn(res);
	});
}
