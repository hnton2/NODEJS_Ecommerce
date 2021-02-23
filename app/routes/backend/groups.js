var express = require('express');
var router 	= express.Router();

const controllerName 	= 'groups';

const systemConfig  	= require(__path_configs + 'system');
const MainModel 		= require(__path_models + controllerName);
const UsersModel 		= require(__path_models + 'users');
const MainValidate	= require(__path_validates + controllerName);
const UtilsHelpers 		= require(__path_helpers + 'utils');
const ParamsHelpers 	= require(__path_helpers + 'params');
const NotifyHelpers		= require(__path_helpers + 'notify');

const linkIndex		 	= '/' + systemConfig.prefixAdmin + `/${controllerName}/`;;
const pageTitleIndex 	= UtilsHelpers.capitalize(controllerName) + ' Management';
const pageTitleAdd  	 = pageTitleIndex + ' - Add';
const pageTitleEdit  	= pageTitleIndex + ' - Edit';
const folderView	 	= __path_views_admin + `pages/${controllerName}/`;

// List groups
router.get('(/status/:status)?', async (req, res, next) => {
	let params 		 = ParamsHelpers.createParams(req);
	let statusFilter = await UtilsHelpers.createFilterStatus(params, controllerName);

	await MainModel.countItems(params).then( (data) => {
		params.pagination.totalItems = data;
	});
	
	MainModel.listItems(params)
		.then( (groups) => {
			res.render(`${folderView}list`, { 
				pageTitle: pageTitleIndex,
				groups,
				statusFilter,
				params
			});
		});
});

// Change status
router.get('/change-status/:id/:status', (req, res, next) => {
	let currentStatus	= ParamsHelpers.getParam(req.params, 'status', 'active'); 
	let id				= ParamsHelpers.getParam(req.params, 'id', ''); 
	MainModel.changeStatus(id, currentStatus, req.user, {tasks: 'change-one'}).then( (result) => {
		NotifyHelpers.showNotify(req, res, linkIndex, {tasks: 'change-status-success'});
	});
});

// Change status - Multi
router.post('/change-status/:status', (req, res, next) => {
	let currentStatus	= ParamsHelpers.getParam(req.params, 'status', 'active'); 
	MainModel.changeStatus(req.body.cid, currentStatus, req.user, {tasks: 'change-multi'}).then( (result) => {
		NotifyHelpers.showNotify(req, res, linkIndex, {n: result.n, tasks: 'change-status-multi-success'});
	});
});

// Change ordering - Multi
router.post('/change-ordering', (req, res, next) => {
	let cids 		= req.body.cid;
	let orderings 	= req.body.ordering;
	
	MainModel.changeOrdering(cids, orderings,  req.user).then( (result) => {
		NotifyHelpers.showNotify(req, res, linkIndex, {tasks: 'change-ordering-success'});
	});
});

// Delete
router.get('/delete/:id', (req, res, next) => {
	let id				= ParamsHelpers.getParam(req.params, 'id', ''); 	
	MainModel.deleteItems(id, {tasks: 'delete-one'}).then( (result) => {
		NotifyHelpers.showNotify(req, res, linkIndex, {tasks: 'delete-success'});
	});
});

// Delete - Multi
router.post('/delete', (req, res, next) => {
	MainModel.deleteItems(req.body.cid, {tasks: 'delete-multi'}).then( (result) => {
		NotifyHelpers.showNotify(req, res, linkIndex, {n: result.n, tasks: 'delete-multi-success'});
	});
});

// FORM
router.get(('/form(/:id)?'), (req, res, next) => {
	let id		= ParamsHelpers.getParam(req.params, 'id', '');
	let group	= {name: '', ordering: 0, status: 'allValue', group_acp: 'allValue', content: ''};
	let errors   = null;
	if(id === '') { // ADD
		res.render(`${folderView}form`, { pageTitle: pageTitleAdd, group, errors});
	}else { // EDIT
		MainModel.getItems({id: id}, {task: 'get-items-by-id'}).then( (group)=>{
			res.render(`${folderView}form`, { pageTitle: pageTitleEdit, group, errors});
		});	
	}
});

// SAVE = ADD EDIT
router.post('/save', (req, res, next) => {
	req.body = JSON.parse(JSON.stringify(req.body));
	MainValidate.validator(req);

	let group = Object.assign(req.body);
	let errors = req.validationErrors();
	let taskCurrent = (typeof group !== "undefined" && group.id !== "") ? 'edit' : 'add';
	let pageTitle = (taskCurrent === 'edit') ? pageTitleEdit : pageTitleAdd;

	if(errors) { 
		res.render(`${folderView}form`, { pageTitle, group, errors});
	} else {
		let notifyTask = (taskCurrent === 'add') ? 'add-success' : 'edit-success';
		MainModel.saveItems(group, req.user, {tasks: taskCurrent}).then( (result) => {
			UsersModel.saveItems(group, {tasks: 'change-group-name'}).then ( (result) =>{
				NotifyHelpers.showNotify(req, res, linkIndex, {tasks: notifyTask});
			})
		});
	}
});


// SORT
router.get(('/sort/:sort_field/:sort_type'), (req, res, next) => {
	req.session.sort_field		= ParamsHelpers.getParam(req.params, 'sort_field', 'ordering');
	req.session.sort_type		= ParamsHelpers.getParam(req.params, 'sort_type', 'asc');
	res.redirect(linkIndex);
});

// Change group_acp
router.get('/change-group-acp/:id/:group_acp', (req, res, next) => {
	let currentGroupACP	= ParamsHelpers.getParam(req.params, 'group_acp', 'yes'); 
	let id				= ParamsHelpers.getParam(req.params, 'id', ''); 
	MainModel.changeGroupACP(id, currentGroupACP, req.user).then( (result) => {
		NotifyHelpers.showNotify(req, res, linkIndex, {tasks: 'change-group-acp-success'});
	});
});
	

module.exports = router;
