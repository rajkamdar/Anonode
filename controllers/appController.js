//External Dependencies
var mongoose=require('mongoose');
var bodyParser=require('body-parser');
var session=require('express-session');
var multer =require('multer');
//Internal Dependencies
var user=require('../models/user');
var confession=require('../models/confession');
var urlencodedParser=bodyParser.urlencoded({extended:false});

mongoose.connect("mongodb://anonoderoot:admin@ds149820.mlab.com:49820/anonode");
mongoose.Promise=global.Promise;

var upload=multer({
  dest:'./userdata/images'
});
module.exports=function(app){

  app.use(session({resave:true,secret: "secret!",saveUninitialized:true}));

  app.get('/',function(req,res){
    res.render('login');
  });

  app.get('/login',function(req,res){
    res.render('login');
  });

  app.post('/login',urlencodedParser,function(req,res){
    user.findOne({uname:req.body.id},function(err,data){
      if(err) throw err;
      if(data!=null){
        user.comparePassword(req.body.pwd,data.pwd,function(match){
          if(match){
            req.session.uname=data.uname;
            res.redirect('/profile/'+data.uname);
          }
          else{
            res.render('login',{error:'Wrong Password'});
          }
        });

      }
      else {
        console.log("Wrong username/pwd");
      }
    });
  });

  app.get('/signup',function(req,res){
    res.render('signup');
  });

  app.post('/signup',upload.single('img'),function(req,res){
    req.checkBody('name','Please enter your name.').notEmpty();
    req.checkBody('uname', 'Username is required.').notEmpty();
    req.checkBody('pwd', 'Password is required.').notEmpty();
    var errors = req.validationErrors();

    if(errors){
      console.log(errors);
      res.render('signup',{errors: errors});
    }
    else{
        user.encrypt(req.body.pwd,function(encryptPassword){
          //console.log(req.file);
          if(req.file!=undefined)
            var img=req.file.path;
          var newUser=new user({
            name:req.body.name,
            uname:req.body.uname,
            pwd:encryptPassword,
            img:img
          }).save(function(err,data){
            if(err) console.log(err);
            else res.render('login');
          });
        });
    }
  });
  app.get('/profile/:name',function(req,res){
    var name=req.params.name;
    user.find({uname:name},function(err,data){
      if(err) throw err;
      else{
        if(data.length!=0){
            var img=data[0].img;

            confession.find({uname:name},function(err,dat){
            if(err) throw err;
            else
                res.render('profile',{confessions:dat,uname:name,img:img,name:data[0].name});
        });
      }
        else{
          res.render('404');
        }

      }

  });
  });
  app.post('/confess',function(req,res){
    var newConfession=confession(req.body).save(function(err,data){
      if(err) throw err;
      console.log(data);
      res.redirect('/profile/'+data.uname);
    });
  });

};
