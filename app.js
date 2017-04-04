var express=require('express');
var controller=require('./controllers/appController');

var app=express();
app.set('view engine','ejs');
app.use(express.static('./public'));

controller(app);
app.listen(3000);
