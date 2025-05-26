'use strict';

const express = require('express');
const app = express();
const port = process.env.port || 5000;
const expresHandlebars = require('express-handlebars');
const {createStarList} = require('./controllers/handlebarsHelper');
const {createPagination} = require('express-handlebars-paginate');
const session = require('express-session');
const Cart = require('./controllers/cart');

//cau hinh static folder
app.use(express.static(__dirname + '/public'));

// cau hịnh su dung express-handlebars
app.engine('hbs',expresHandlebars.engine({
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    extname: 'hbs',
    defaultLayout: 'layout',
    runtimeOptions:{
        allowProtoPropertiesByDefault: true
    },
    helpers: {
        createStarList,
        createPagination
    }
})); 
app.set('view engine','hbs');

//cau hinh doc du lieu post tu body
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//cau hinh su dung session
app.use(session({
    secret: 'S3cret',
    resave: false,
    saveUninitialized: false,
    cookie:{
        httpOnly: true,
        maxAge: 20 * 60 * 1000 // 20ph
    }
}));

//middleware khoi tao gio hang
app.use((req, res, next) => {
    // Khôi phục cart từ session data
    req.session.cart = new Cart(req.session.cart || {});
    res.locals.quantity = req.session.cart.quantity;
    next();
});

// Routes
app.use('/', require('./routes/indexRouter.js'));
app.use('/products', require('./routes/productsRouter.js'));
app.use('/users', require('./routes/usersRouter.js'));

// Error Handlers
app.use((req, res, next) => {
    res.status(404).render('error', {message: 'File not Found!'});
});

app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).render('error', {message: 'Internal Server Error'});
});

app.listen(port, () => {
    console.log(`server is running port ${port}`);
});