var mongoose=require('mongoose');
var bcrypt=require('bcrypt');
var userSchema=mongoose.model('users',new mongoose.Schema({
  name:String,
  uname:{type: String,unique:true},
  pwd:String
}));

module.exports=userSchema;

module.exports.encryption = function(newUser, callback){
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
        newUser.password = hash;
        newUser.save(callback);
    });
  });
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	user.findOne(query, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}
