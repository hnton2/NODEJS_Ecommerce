

let getParam = (params, property, defaultValue ) => {
    if(params.hasOwnProperty(property) && params[property] !== undefined){
		return params[property];
	}

	return defaultValue;
}

let createParams = (req ) => {
    let params 		 = {};

	params.keyword		 = getParam(req.query, 'keyword', '');
	params.currentStatus = getParam(req.params, 'status', 'all'); 
	params.sortField  	 = getParam(req.session, 'sort_field', 'name');
	params.sortType 	 = getParam(req.session, 'sort_type', 'asc');
	params.pagination 	 = {
		totalItems		 : 1,
		totalItemsPerPage: 5,
		currentPage		 : parseInt(getParam(req.query, 'page', 1)),
		pageRanges		 : 3
	};

	return params;
}


let createParamsFrontend = (req ) => {
    let params 		 = {};
	let strSort		    = getParam(req.query, 'sort', 'name-asc');
	params.sortType 	= strSort.split('-')[1];
  	params.sortField 	= strSort.split('-')[0];
	params.price        = getParam(req.query, 'filter-price', 'all');
	params.size        	= getParam(req.query, 'size', 'all');
	params.color        = getParam(req.query, 'color', 'all');
	params.keyword        = getParam(req.query, 'search', '');
	params.pagination 	 = {
		totalItems		 : 1,
		totalItemsPerPage: 24,
		currentPage		 : parseInt(getParam(req.query, 'page', 1)),
		pageRanges		 : 3
	};
	return params;
}

module.exports = {
	getParam,
	createParamsFrontend,
	createParams
}