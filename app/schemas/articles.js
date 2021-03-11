const mongoose = require('mongoose');
const databaseConfig = require(__path_configs + 'database');

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

module.exports = mongoose.model(databaseConfig.col_articles, schema );