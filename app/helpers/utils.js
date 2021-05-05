let createFilterStatus =  async (params, collection) => {
	const Model = require(__path_schemas +  collection);
    let statusFilter = [
		{name: 'All', value: 'all', count: 0, class: 'secondary'},
		{name: 'Active', value: 'active',  count: 0, class: 'secondary'},
		{name: 'InActive', value: 'inactive',  count: 0, class: 'secondary'}
	];

	for(let index = 0; index < statusFilter.length; index++) {
		let item = statusFilter[index];

		let objWhere	 = {};
		if(item.value !== 'all') objWhere.status = item.value;
		if(params.keyword !== '') objWhere.name = new RegExp(params.keyword, 'i');
		// if(params.groupID !== '') objWhere.groupID = params.groupID;
		if(item.value === params.currentStatus) statusFilter[index].class = 'success';
		
		await Model
		.countDocuments(objWhere)
		.then( (data) => {
			statusFilter[index].count = data;
		});
	}

    return statusFilter;
}

const capitalize = (str) => {
	if (typeof str !== 'string') return ''
	return str.charAt(0).toUpperCase() + str.slice(1)
}

let countCollections = async (model) => {
    let total = 0;
	await model.countDocuments({}).then( (count) =>{ 
		total = count;
	});
    return total;
}

module.exports = {
	createFilterStatus: createFilterStatus,
	capitalize: capitalize,
	countCollections,
}