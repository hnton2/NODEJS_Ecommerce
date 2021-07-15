const mongoose = require('mongoose');
const databaseConfig = require(__path_configs + 'database');
var db      = mongoose.createConnection(`mongodb+srv://${databaseConfig.username}:${databaseConfig.password}@cluster01.em0e0.mongodb.net/${databaseConfig.database_products}?retryWrites=false&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

var schema = new mongoose.Schema({ 
    name: String,
    code: String,
    status: String,
    price: Number,
    amount: Number,
    used_times: {type: Number, default: 0},
    duration: String,
    content: String,
});

module.exports = db.model(databaseConfig.col_promo, schema );