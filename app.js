var express=require('express');
var controller=require('./controllers/appController');
var expressValidator=require('express-validator');


var app=express();
app.set('view engine','ejs');
app.use(express.static('./public'));
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));




controller(app);
app.listen(3000);
console.log("Server Started");
