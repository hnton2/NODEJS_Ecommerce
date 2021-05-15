const Model 	= require(__path_schemas + 'clothing-category');

module.exports = {
    listItems: (params, options = null) => {
        let sort 		 = {};
        sort[params.sortField] = params.sortType;
        
        let objWhere	 = {};
        if(params.currentStatus !== 'all') objWhere.status = params.currentStatus;
        if(params.keyword !== '') objWhere.name = new RegExp(params.keyword, 'i');
    
    
        return Model
		.find(objWhere)
		.select('name status ordering created modified slug amount')
		.sort(sort)
		.skip((params.pagination.currentPage-1) * params.pagination.totalItemsPerPage)
		.limit(params.pagination.totalItemsPerPage)
    },
    getItems: (params = null, option = null) => {
        if(option.task == 'get-items-by-id'){
            return Model.findById(params.id);
        }
        if(option.task == 'get-name-items'){
            return Model.find({}, {_id: 1, name: 1});
        }
        if(option.task == 'get-items-by-name'){
            return Model.find({name: params.category}).select('name slug');
        }
    },
    listItemsFrontend: (params = null, option = null) => {
        let find = {};
        let select = 'name slug amount';
        let limit = 10;
        let sort = {};

        if(option.task == 'items-in-menu'){
            find = {status:'active'};
            sort = {ordering: 'asc'};
        }

        return Model.find(find).select(select).limit(limit).sort(sort);
    },
    countItems: (params, option = null) => {
        let objWhere	 = {};
        if(params.currentStatus !== 'all') objWhere.status = params.currentStatus;
        if(params.keyword !== '') objWhere.name = new RegExp(params.keyword, 'i');

        return Model.countDocuments(objWhere);
    },
    updateAmountOfItem: (id, state) => {
        return Model.findOneAndUpdate({_id :id}, {$inc : {'amount' : state}}).exec();
    },
    changeStatus: (id, currentStatus, user, option = null) => {
        let status = '';
        if(!Array.isArray(id)) status = (currentStatus === "active") ? "inactive" : "active";
        else status = currentStatus;
        let data = {
            status: status,
            modified: {
                user_id: user.id,
                user_name: user.username,
                time: Date.now()
            }
        };
        if(option.tasks = 'change-multi'){
            return Model.updateMany({_id: {$in: id }}, data);
        } else if(option.tasks = 'change-one'){
            return Model.updateOne({_id: id}, data);
        }
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
                user_id: '1',
				user_name: 'admin',
				time: Date.now()
            }
            return new Model(item).save();
        }else if(option.tasks === 'edit') {
            return Model.updateOne({_id: item.id}, {
				ordering: parseInt(item.ordering),
                name: item.name,
                slug: item.slug,
				status: item.status,
				content: item.content,
				modified: {
					user_id: '2', 
					user_name: 'admin',
					time: Date.now()
				}   
			});
        }
    }
    
}