const mongoose = require('mongoose');
const databaseConfig = require(__path_configs + 'database');
var db  = mongoose.createConnection(`mongodb+srv://${databaseConfig.username}:${databaseConfig.password}@cluster01.em0e0.mongodb.net/${databaseConfig.database_products}?retryWrites=false&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

var schema = new mongoose.Schema({ 
    code: String, 
    status: String,
    shipping_fee: Number,
    user: {
        first_name: String, 
        last_name: String,
        email: String,
        phone: String,
        address: String,
        message: String,
    },
    product: [{
        id: String,
        name: String,
        quantity: Number,
        size: String,
        price: Number,
        thumb: String,
        slug: String
    }],
    time: Date,
    promo_code: {
        name: String,
        value: Number
    },
    total: Number
});

module.exports = db.model(databaseConfig.col_order, schema );