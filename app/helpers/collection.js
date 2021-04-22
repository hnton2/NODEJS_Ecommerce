const fs    = require('fs'); 
const { Collection } = require('mongoose');
const Model 	= require(__path_schemas + 'shipping');


let initCollection = (collection) => {
        
    Model.findOne({},function(err,doc){
        if(!doc){
            collection.forEach(function(obj){
                new Model(obj).save();
            });
        }
    });
}

module.exports = {
	initCollection
}