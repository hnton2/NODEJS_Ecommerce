const mongoose = require('mongoose');
const databaseConfig = require(__path_configs + 'database');
var db  = mongoose.createConnection(`mongodb+srv://${databaseConfig.username}:${databaseConfig.password}@cluster01.em0e0.mongodb.net/${databaseConfig.database_articles}?retryWrites=false&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

var schema = new mongoose.Schema({ 
    name: String,
    slug: String,
    summary: String, 
    status: String,
    special: String,
    trending: String,
    ordering: Number,
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
    thumb: String
});
schema.index({name: 'text', summary: 'text', content: 'text', 'category.name': 'text'});

module.exports = db.model(databaseConfig.col_articles, schema );