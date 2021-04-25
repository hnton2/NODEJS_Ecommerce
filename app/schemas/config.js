const mongoose = require('mongoose');
const databaseConfig = require(__path_configs + 'database');
var db  = mongoose.createConnection(`mongodb+srv://${databaseConfig.username}:${databaseConfig.password}@cluster01.em0e0.mongodb.net/${databaseConfig.database_articles}?retryWrites=false&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

var schema = new mongoose.Schema({
    name_website: String,
    logo: String,
    email: String, 
    password_email: String,
    hotline: String,
    address: String,
    facebook: String,
    instagram: String,
    twitter: String,
    map: String, 
    about: String,
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
});

module.exports = db.model(databaseConfig.col_config, schema );