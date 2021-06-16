const mongoose = require('mongoose');
const databaseConfig = require(__path_configs + 'database');
var db = mongoose.createConnection(`mongodb+srv://${databaseConfig.username}:${databaseConfig.password}@cluster01.em0e0.mongodb.net/${databaseConfig.database_products}?retryWrites=false&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

var schema = new mongoose.Schema({ 
    name: String,
    slug: String,
    brand: {
        id: String,
        name: String
    },
    price: Number,
    sale_off: Number,
    quantity: Number,
    sold: {type: Number, default: 0},
    status: String,
    special: String,
    ordering: Number,
    product_type: { type: String, default: 'clothing' },
    category: {
        id: String,
        name: String
    },
    created: {
        user_id: String,
        user_name: String,
        time: Date
    },
    modified: {
        user_id: String,
        user_name: String,
        time: Date
    },
    content: String,
    thumb: [String],
    tags: String,
    size: String,
    color: String,
    reviews: [{
        name: String,
        email: String,
        time: Date,
        rating: Number,
        content: String
    }],
    favorite: Number,
});
schema.index({name: 'text', content: 'text', 'category.name': 'text', 'brand.name': 'text'});

module.exports = db.model(databaseConfig.col_clothing, schema );