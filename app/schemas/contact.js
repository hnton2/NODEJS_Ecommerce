const mongoose = require('mongoose');
const databaseConfig = require(__path_configs + 'database');
var db  = mongoose.createConnection(`mongodb+srv://${databaseConfig.username}:${databaseConfig.password}@cluster01.em0e0.mongodb.net/${databaseConfig.database_articles}?retryWrites=false&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

var schema = new mongoose.Schema({ 
    name: String,
    email: String,
    phone: String,
    message: String,
    status: String,
    register_time: Date,
});

module.exports = db.model(databaseConfig.col_contact, schema );