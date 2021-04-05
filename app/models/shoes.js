const Model 	    = require(__path_schemas + 'shoes');
const CategoryModel 	    = require(__path_schemas + 'product-category');
const FileHelpers   = require(__path_helpers + 'file');
const uploadFolder  = __path_uploads + 'shoes/';

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
		.select('name slug status special ordering created modified category.name price quantity sale_off brand thumb size color tags')
		.sort(sort)
		.skip((params.pagination.currentPage-1) * params.pagination.totalItemsPerPage)
		.limit(params.pagination.totalItemsPerPage)
    },
    listItemsFrontend: (params = null, option = null) => {
        let find = {};
        let select = 'name slug created category.name category.id thumb brand price sale_off';
        let limit = 3;
        let sort = {};

        if(option.task == 'all-items'){
            find = {status:'active'};
            limit = 50;
            sort = {'created.time': 'desc'};
            select += ' content';
        }
        if(option.task == 'new-items'){
            find = {status:'active'};
            limit = 8;
            sort = {'created.time': 'desc'};
        }
        if(option.task == 'items-special'){
            find = {status:'active', special: 'active'};
            sort = {ordering: 'asc'};
            limit = 8;
        }

        if(option.task == 'items-trending'){
            find = {status:'active', trending: 'active'};
            sort = {ordering: 'asc'};
            limit = 8;
        }

        if(option.task == 'items-news'){
            find = {status:'active'};
            select += ' content';
            sort = {'created.time': 'desc'};
        }

        if(option.task == 'items-in-category'){
            find = {status:'active', 'category.id': params.id};
            select += ' content';
            limit = 0;
            sort = {ordering: 'asc'};
        }

        if(option.task == 'items-random'){
            return Model.aggregate([
                { $match: {status: 'active'}},
                { $project: {_id: 1, name: 1, created: 1, thumb: 1} },
                { $sample: {size: 5}}
            ]);
        }
        if(option.task == 'items-related'){
            find = {status:'active', 'category.id': params.category.id, '_id': {$ne: params.id} };
            sort = {ordering: 'asc'};
        }
        if(option.task == 'items-search'){
            return Model.find({$text: {$search: params.keyword}})
                    .limit(5)
                    .exec();
        }

        return Model.find(find).select(select).limit(limit).sort(sort);
    },
    getMainArticle: (slug, option = null) => { 
        let select = 'name slug brand category.name category.id price thumb content sale_off';
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
                for(let idx = 0; idx < item.thumb.length; idx++) {
					FileHelpers.remove(uploadFolder, item.thumb[idx]);
				}
            });
            return Model.deleteOne({_id: id});
        } else if(option.tasks === 'delete-multi') {
            if(Array.isArray(id)){
                for(let index = 0; index < id.length; index++){
                    await Model.findById(id[index]).then((item) => {
                        for(let idx = 0; idx < item.thumb.length; idx++) {
                            FileHelpers.remove(uploadFolder, item.thumb[idx]);
                        }
                    }); 
                }
            }else{
                await Model.findById(id).then((item) => {
                    for(let idx = 0; idx < item.thumb.length; idx++) {
                        FileHelpers.remove(uploadFolder, item.thumb[idx]);
                    }
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
				name: item.category_name
            },
            item.brand = {
				id: item.brand_id,
				name: item.brand_name
            }
            return new Model(item).save();
        }else if(option.tasks === 'edit') {
            return Model.updateOne({_id: item.id}, {
				ordering: parseInt(item.ordering),
                name: item.name,
                slug: item.slug,
                status: item.status,
                special: item.special,
                price: item.price,
                quantity: item.quantity,
                sale_off: item.sale_off,
                content: item.content,
                thumb: item.thumb,
                size: item.size,
                color: item.color,
                tags: item.tags,
				modified: {
					user_id: user.id, 
					user_name: user.username,
					time: Date.now()
                },
                category: {
					id: item.category_id,
					name: item.category_name
				},
                brand: {
                    id: item.brand_id,
                    name: item.brand_name
                }
			});
        } else if(option.tasks === 'change-category-name') {
            return Model.updateMany({'category.id': item.id}, {
                category: {
                    id: item.id,
					name: item.name
				},
                brand: {
                    id: item.brand_id,
                    name: item.brand_name
                }
            });
        }
    }
}