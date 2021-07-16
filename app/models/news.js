const Model 	    = require(__path_schemas + 'news');
const FileHelpers   = require(__path_helpers + 'file');
const uploadFolder  = __path_uploads + 'news/';

module.exports = {
    listItems: (params, options = null) => {
        let sort 		 = {};
        let objWhere	 = {};
        sort[params.sortField] = params.sortType;
	    if(params.categoryID !== 'allValue' && params.categoryID !== '') objWhere['category.id'] = params.categoryID;
        if(params.currentStatus !== 'all') objWhere.status = params.currentStatus;
        if(params.keyword !== '') objWhere.name = new RegExp(params.keyword, 'i');
    
    
        return Model
		.find(objWhere)
		.select('name slug status ordering created modified category.name thumb special trending')
		.sort(sort)
		.skip((params.pagination.currentPage-1) * params.pagination.totalItemsPerPage)
		.limit(params.pagination.totalItemsPerPage)
    },
    listItemsFrontend: (params = null, option = null) => {
        let find = {status:'active'};
        let select = 'name slug created category.name category.id thumb comments';
        let limit = 3;
        let sort = {};       

        if(option.task == 'all-items'){
            if(params.keyword !== '')   find = {name: new RegExp(params.keyword, 'i'), status:'active'};
            else find = {status:'active'};
            limit = 50;
            sort = {'created.time': 'desc'};
            select += ' summary';
        }
        if(option.task == 'items-special'){
            find = {status:'active', special: 'active'};
            sort = {ordering: 'asc'};
            limit = 3;
            select += ' summary';
        }

        if(option.task == 'items-trending'){
            if(params.keyword !== '')   find = {name: new RegExp(params.keyword, 'i'), status:'active', trending: 'active'};
            else find = {status:'active', trending: 'active'};
            sort = {ordering: 'asc'};
            limit = 8;
            select += ' summary';
        }

        if(option.task == 'items-news'){
            find = {status:'active'};
            select += ' summary';
            sort = {'created.time': 'desc'};
            limit = 8;
        }

        if(option.task == 'items-in-category'){
            if(params.keyword !== '')   find = {name: new RegExp(params.keyword, 'i'), status:'active', 'category.id': params.id};
            else find = {status:'active', 'category.id': params.id};
            select += ' summary';
            sort = {ordering: 'asc'};
        }

        if(option.task == 'items-random'){
            return Model.aggregate([
                { $match: {status: 'active'}},
                { $project: {_id: 1, name: 1, created: 3, thumb: 1} },
                { $sample: {size: 8}}
            ]);
        }
        if(option.task == 'items-related'){
            find = {status:'active', 'category.id': params.category.id, '_id': {$ne: params.id} }; 
            sort = {ordering: 'asc'};
            select += ' summary';
        }
        if(option.task == 'items-search'){
            return Model.find({$text: {$search: params.keyword}})
                    .limit(5)
                    .exec();
        }

        return Model.find(find).select(select).limit(limit).sort(sort);
    },
    getMainItems: (slug, option = null) => {
        let select = 'name created slug category.name category.id thumb summary content comments';
        return Model.find({slug: slug}).select(select);
    },
    getItems: (id, option = null) => {
        return Model.findById(id);
    },
    countItems: (params, option = null) => {
        let objWhere	 = {};
        if(params.currentStatus !== 'all') objWhere.status = params.currentStatus;
        if(params.keyword !== '') objWhere.name = new RegExp(params.keyword, 'i');
        if(params.categoryID !== '') objWhere.categoryID = params.categoryID;
        
        return Model.count(objWhere);
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
    changeSpecial: (id, currentSpecial, user, option = null) => {
        let special = '';
        if(!Array.isArray(id)) special = (currentSpecial === "active") ? "inactive" : "active";
        else special = currentSpecial;
        let data = {
            special: special,
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
    changeTrending: (id, currentTrending, user, option = null) => {
        let trending = '';
        if(!Array.isArray(id)) trending = (currentTrending === "active") ? "inactive" : "active";
        else trending = currentTrending;
        let data = {
            trending: trending,
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
                FileHelpers.remove(uploadFolder, item.thumb);
            });
            return Model.deleteOne({_id: id});
        } else if(option.tasks === 'delete-multi') {
            if(Array.isArray(id)){
                for(let index = 0; index < id.length; index++){
                    await Model.findById(id[index]).then((item) => {
                        FileHelpers.remove(uploadFolder, item.thumb);
                    }); 
                }
            }else{
                await Model.findById(id).then((item) => {
                    FileHelpers.remove(uploadFolder, item.thumb);
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
            item.category = {
				id: item.category_id,
				name: item.category_name,
            }
            return new Model(item).save();
        }else if(option.tasks === 'edit') {
            return Model.updateOne({_id: item.id}, {
				ordering: parseInt(item.ordering),
                name: item.name,
                slug: item.slug,
                status: item.status,
                special: item.special,
                trending: item.trending,
                summary: item.summary,
                content: item.content,
                thumb: item.thumb,
				modified: {
					user_id: '1', 
					user_name: 'admin',
					time: Date.now()
                },
                category: {
					id: item.category_id,
					name: item.category_name,
				}
			});
        } else if(option.tasks === 'change-category-name') {
            return Model.updateMany({'category.id': item.id}, {
                category: {
                    id: item.id,
					name: item.name,
				}
            });
        }
    },
    saveReview: (id, item) => {
        return Model.update(
            { _id: id }, 
            { $push: { comments: item } }
        );
    },
}