var express = require('express');
var router 	= express.Router();

const controllerName 	= 'shipping';

const systemConfig  	= require(__path_configs + 'system');
const MainModel 		= require(__path_models + controllerName);
//const MainValidate		= require(__path_validates + controllerName);
const UtilsHelpers 		= require(__path_helpers + 'utils');
const ParamsHelpers 	= require(__path_helpers + 'params');
const NotifyHelpers 	= require(__path_helpers + 'notify');
const CollectionHelpers 	= require(__path_helpers + 'collection');

const notify  		= require(__path_configs + 'notify');

const linkIndex		 	= '/' + systemConfig.prefixAdmin + `/${controllerName}/`;
const pageTitleIndex 	= UtilsHelpers.capitalize(controllerName) + ' Management';
const pageTitleAdd   	= pageTitleIndex + ' - Add';
const folderView	 	= __path_views_admin + `pages/${controllerName}/`;

// List items
router.get('/', async (req, res, next) => {
	CollectionHelpers.initCollection(systemConfig.VietNamProvince);
	let params 		 = ParamsHelpers.createParams(req);
	let statusFilter = await UtilsHelpers.createFilterStatus(params, controllerName);

	await MainModel.countItems(params).then( (data) => {
		params.pagination.totalItems = data;
	});
	
	MainModel.listItems(params)
		.then( (items) => {
			res.render(`${folderView}list`, { 
				pageTitle: pageTitleIndex,
				items,
				statusFilter,
				params
			});
		});

});

// Change ordering - Multi
router.post('/change-fee/:id/:value', (req, res, next) => {
	let id 			= ParamsHelpers.getParam(req.params, 'id', '');
	let value 		= ParamsHelpers.getParam(req.params, 'value', 0);
	
	MainModel.changeShippingFee(id, value).then( (result) => {
		//NotifyHelpers.showNotify(req, res, linkIndex, {tasks: 'change-ordering-success'});
		res.json({'message': notify.CHANGE_FEE_SUCCESS});
	});
});

// SAVE = ADD EDIT
router.post('/save', async (req, res, next) => {
	req.body = JSON.parse(JSON.stringify(req.body));
	MainValidate.validator(req);

	let item = Object.assign(req.body);
	let errors = req.validationErrors();
	await MainModel.getItems({name: item.name}, {task: 'get-items-by-name'}).then( (item) =>{
		if(item.length > 0) {
			errors.unshift({param: 'name', msg: 'Đã tồn tại'});
		}
	});
	let taskCurrent = (typeof item !== "undefined" && item.id !== "") ? 'edit' : 'add';
	let pageTitle = (taskCurrent === 'edit') ? pageTitleEdit : pageTitleAdd;

	if(errors) { 
		res.render(`${folderView}form`, { pageTitle, item, errors});
	} else {
		let notifyTask = (taskCurrent === 'add') ? 'add-success' : 'edit-success';
		MainModel.saveItems(item, req.user, {tasks: taskCurrent}).then( (result) => {
			NotifyHelpers.showNotify(req, res, linkIndex, {tasks: notifyTask});
		});
	}
});


// SORT
router.get(('/sort/:sort_field/:sort_type'), (req, res, next) => {
	req.session.sort_field		= ParamsHelpers.getParam(req.params, 'sort_field', 'ordering');
	req.session.sort_type		= ParamsHelpers.getParam(req.params, 'sort_type', 'asc');
	res.redirect(linkIndex);
});

module.exports = router;