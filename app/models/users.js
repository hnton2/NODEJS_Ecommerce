const Model 	    = require(__path_schemas + 'users');
const FileHelpers   = require(__path_helpers + 'file');
const uploadFolder  = 'public/uploads/users/';

module.exports = {
    listItems: (params, options = null) => {
        let sort 		 = {};
        let objWhere	 = {};
        sort[params.sortField] = params.sortType;
	    if(params.groupID !== 'allValue' && params.groupID !== '') objWhere['group.id'] = params.groupID;
        if(params.currentStatus !== 'all') objWhere.status = params.currentStatus;
        if(params.keyword !== '') objWhere.name = new RegExp(params.keyword, 'i');
    
        return Model
		.find(objWhere)
		.select('name status ordering created modified group.name avatar username')
		.sort(sort)
		.skip((params.pagination.currentPage-1) * params.pagination.totalItemsPerPage)
		.limit(params.pagination.totalItemsPerPage)
    },
    getItems: (id, option = null) => {
        return Model.findById(id);
    },
    getItemByUsername: (username, option = null) => {
        return Model.find({status: 'active', username: username}).select('username password avatar status group.name');
    },
    countItems: (params, option = null) => {
        let objWhere	 = {};
        if(params.currentStatus !== 'all') objWhere.status = params.currentStatus;
        if(params.keyword !== '') objWhere.name = new RegExp(params.keyword, 'i');

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
                user_id: user.id,
				user_name: user.username,
				time: Date.now()
            },
            item.group = {
				id: item.group_id,
				name: item.group_name
			}
            return new Model(item).save();
        }else if(option.tasks === 'edit') {
            return Model.updateOne({_id: item.id}, {
				ordering: parseInt(item.ordering),
				name: item.name,
                username: item.username,
                password: item.password,
				status: item.status,
                content: item.content,
                avatar: item.avatar,
				modified: {
					user_id: user.id,
					user_name: user.username,
					time: Date.now()
                },
                group: {
					id: item.group_id,
					name: item.group_name
				}
			});
        } else if(option.tasks === 'change-group-name') {
            return Model.updateMany({'group.id': item.id}, {
                group: {
                    id: item.id,
					name: item.name
				}
            });
        }
    }
}