const Model 	    = require(__path_schemas + 'banner');
const FileHelpers   = require(__path_helpers + 'file');
const uploadFolder  = 'public/uploads/slider/';

module.exports = {
    listItems: (params, options = null) => {
        let sort 		 = {};
        let objWhere	 = {};
        sort[params.sortField] = params.sortType;
        if(params.currentStatus !== 'all') objWhere.status = params.currentStatus;
        if(params.keyword !== '') objWhere.link = new RegExp(params.keyword, 'i');
    
        return Model
		.find(objWhere)
		.select('status ordering created modified thumb link ')
		.sort(sort)
		.skip((params.pagination.currentPage-1) * params.pagination.totalItemsPerPage)
		.limit(params.pagination.totalItemsPerPage)
    },
    getItems: (id, option = null) => {
        return Model.findById(id);
    },
    listItemsFrontend: (params = null, option = null) => {
        let find = {status:'active'};
        let select = 'link thumb ordering';
        let limit = 7;
        let sort = {ordering: 'asc'};
        return Model.find(find).select(select).limit(limit).sort(sort);
    },
    countItems: (params, option = null) => {
        let objWhere	 = {};
        if(params.currentStatus !== 'all') objWhere.status = params.currentStatus;
        if(params.keyword !== '') objWhere.link = new RegExp(params.keyword, 'i');

        return Model.countDocuments(objWhere);
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
                user_id: '1',
                user_name: 'admin',
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
    deleteItems: async (id, option = null) => {
        if(option.tasks === 'delete-one') {
            await Model.findById(id).then((item) => {
                FileHelpers.remove(uploadFolder, item.avatar);
            });
            return Model.deleteOne({_id: id});
        } else if(option.tasks === 'delete-multi') {
            if(Array.isArray(id)){
                for(let index = 0; index < id.length; index++){
                    await Model.findById(id[index]).then((item) => {
                        FileHelpers.remove(uploadFolder, item.avatar);
                    }); 
                }
            }else{
                await Model.findById(id).then((item) => {
                    FileHelpers.remove(uploadFolder, item.avatar);
                });
            }
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
                link: item.link,
				status: item.status,
                content: item.content,
                thumb: item.thumb,
				modified: {
					user_id: '2',
					user_name: 'admin',
					time: Date.now()
                }
			});
        }
    }
}