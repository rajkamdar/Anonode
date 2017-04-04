//External Dependencies
var mongoose=require('mongoose');
var bodyParser=require('body-parser');
var session=require('express-session');
//Internal Dependencies
var user=require('../models/user');
var confession=require('../models/confession');
var urlencodedParser=bodyParser.urlencoded({extended:false});

mongoose.connect("mongodb://anonoderoot:admin@ds149820.mlab.com:49820/anonode");
mongoose.Promise=global.Promise;


module.exports=function(app){

  app.use(session({resave:true,secret: "secret!",saveUninitialized:true}));

  app.get('/',function(req,res){
    res.render('login');
  });

  app.get('/login',function(req,res){
    res.render('login');
  });

  app.post('/login',urlencodedParser,function(req,res){
    user.findOne({uname:req.body.id,pwd:req.body.pwd},function(err,data){
      if(err) throw err;
      if(data!=null){
        req.session.uname=data.uname;
        res.redirect('/profile/'+data.uname);
      }
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
      if(err) console.log(err);
      else res.render('login');
    });
  });
  app.get('/profile/:name',function(req,res){
    var name=req.params.name;
    user.find({uname:name},function(err,data){
      if(err) throw err;
      else{
        if(data.length!=0){
            confession.find({uname:name},function(err,data){
            if(err) throw err;
            else
                res.render('profile',{confessions:data,uname:name});
        });
      }
        else{
          res.render('404');
        }

      }

  });
  });
  app.post('/confess',urlencodedParser,function(req,res){
    var newConfession=confession(req.body).save(function(err,data){
      if(err) throw err;
      console.log(data);
      res.redirect('/profile/'+data.uname);
    });
  });
};
