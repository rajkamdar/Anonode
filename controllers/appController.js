var mongoose=require('mongoose');
var bodyParser=require('body-parser');

var urlencodedParser=bodyParser.urlencoded({extended:false});

mongoose.connect("mongodb://anonoderoot:admin@ds149820.mlab.com:49820/anonode");
mongoose.Promise=global.Promise;

var userSchema=new mongoose.Schema({
  name:String,
  uname:{type: String,unique:true},
  pwd:String
});

 var confessionSchema=new mongoose.Schema({
   msg:String,
   uname:String
 });
var user=mongoose.model('users',userSchema);
var confession=mongoose.model('confessions',confessionSchema);

module.exports=function(app){
  app.get('/',function(req,res){
    res.render('login');
  });

  app.get('/login',function(req,res){
    res.render('login');
  });

  app.post('/login',urlencodedParser,function(req,res){
    user.findOne({uname:req.body.id,pwd:req.body.pwd},function(err,data){
      if(err) throw err;
      if(data!=null)
        res.redirect('/home');
      else {
        console.log("Wrong username/pwd");
      }
    });
  });

  app.get('/signup',function(req,res){
    res.render('signup');
  });

  app.post('/signup',urlencodedParser,function(req,res){
    var newUser=user(req.body).save(function(err,data){
      if(err) throw err;
      res.render('home');
    });
  });
  app.get('/home',function(req,res){
    confession.find({},function(err,data){
      if(err) throw err;
      res.render('home',{confessions:data});
    });
  });
  app.post('/home',urlencodedParser,function(req,res){
    var newConfession=confession(req.body).save(function(err,data){
      if(err) throw err;
      res.redirect('home');
    });
  });
};
