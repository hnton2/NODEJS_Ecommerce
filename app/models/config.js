const Model 	    = require(__path_schemas + 'config');

module.exports = {
    
    listItemsFrontend: (params = null, option = null) => {
        let find = {};
        let select = 'name avatar group.name';
        let limit = 5;
        let sort = {ordering: 'asc'};

        return Model.find(find).select(select).limit(limit).sort(sort);
    },
    getItems: () => {
        return Model.find();
    },
    countItems: (params, option = null) => {
        let objWhere	 = {};
        if(params.currentStatus !== 'all') objWhere.status = params.currentStatus;
        if(params.keyword !== '') objWhere.name = new RegExp(params.keyword, 'i');

        return Model.countDocuments(objWhere);
    },
    saveItems: (item, user, option = null) => {
        if(option.tasks === 'add') {
            item.created = {
                user_id: user.id,
				user_name: user.username,
				time: Date.now()
            }
            return new Model(item).save();
        } else if(option.tasks === 'edit') {
            return Model.updateOne({_id: item.id}, {
				name_website: item.name_website,
                email: item.email,
                password_email: item.password_email,
				hotline: item.hotline,
                address: item.address,
                facebook: item.facebook,
                instagram: item.instagram,
                twitter: item.twitter,
                map: item.map,
                about: item.about,
                logo: item.logo,
				modified: {
					user_id: user.id,
					user_name: user.username,
					time: Date.now()
                }
			});
        }
    }
}