'use strict';

const express = require('express');
const app =express();
const expressHandlebars =require('express-handlebars');
const port = process.env.PORT || 5000;

// cau hình public folder
app.use(express.static(__dirname+'/public'));

//cau hinh expreshandlebars
app.engine('hbs',expressHandlebars.engine({
    layoutsDir: __dirname+'/views/layouts',
    partialsDir: __dirname+'/views/partials',
    extname: 'hbs',
    defaultLayout: 'layout'
}));
app.set('view engine','hbs');
//route
app.get('/',(req,res)=>{
    res.render('index');
});

app.get('/:page',(req,res)=>{
    res.render(req.params.page);
});
//Khoi dong web server

app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})