const Model 	= require(__path_schemas + 'shipping');

module.exports = {
    listItems: (params, options = null) => {
        let sort 		 = {};
        sort[params.sortField] = params.sortType;
        
        let objWhere	 = {};
        if(params.currentStatus !== 'all') objWhere.status = params.currentStatus;
        if(params.keyword !== '') objWhere.name = new RegExp(params.keyword, 'i');
    
        return Model
		.find(objWhere)
		.select('name code cost')
		.sort(sort)
    },
    getItems: (params = null, option = null) => {
        if(option.task == 'get-items-by-id'){
            return Model.findById(params.id);
        }
        if(option.task == 'get-items-by-name'){
            return Model.find({name : params.name});
        }
    },
    countItems: (params, option = null) => {
        let objWhere	 = {};
        if(params.currentStatus !== 'all') objWhere.status = params.currentStatus;
        if(params.keyword !== '') objWhere.name = new RegExp(params.keyword, 'i');

        return Model.countDocuments(objWhere);
    },
    changeOrdering: async (id, ordering, user, option = null) => {
        let data = {
            ordering: parseInt(ordering),
            modified: {
                user_id: user.id,
                user_name: user.username,
                time: Date.now()
            }
        };
        if(Array.isArray(id)) {
            for(let index = 0; index < id.length; index ++){
                data.ordering = parseInt(ordering[index]);
                await Model.updateOne({_id: id[index]}, data)
            }
            return Promise.resolve("Success");
        } else {
            return Model.updateOne({_id: id}, data);
        }
    },
    deleteItems: (id, option = null) => {
        if(option.tasks === 'delete-one') {
            return Model.deleteOne({_id: id});
        } else if(option.tasks === 'delete-multi') {
            return Model.remove({_id: {$in: id}});
        }
    },
    saveItems: (item, user, option = null) => {
        if(option.tasks === 'add') {
            item.created = {
                user_id: user.id,
				user_name: user.username,
				time: Date.now()
            }
            return new Model(item).save();
        }else if(option.tasks === 'edit') {
            return Model.updateOne({_id: item.id}, {
				ordering: parseInt(item.ordering),
				name: item.name,
				status: item.status,
				content: item.content,
				modified: {
					user_id: user.id, 
					user_name: user.username,
					time: Date.now()
				}   
			});
        }
    }
    
}