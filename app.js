const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productsRouts = require('./api/routes/products');
const orderRouts = require('./api/routes/orders');

mongoose.connect(
    'mongodb+srv://admin:' + 
    process.env.MONGO_ATLAS_PW + 
    '@node-rest-shop-xkokr.mongodb.net/test?retryWrites=true&w=majority', 
    {
    useMongoClient: true
});
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/*
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({})
    }
});
*/

// Routes whitch shold handle requests
app.use('/products', productsRouts);
app.use('/orders', orderRouts);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;