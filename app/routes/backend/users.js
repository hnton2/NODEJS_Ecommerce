var express = require('express');
var router 	= express.Router();

const controllerName 	= 'users';
const folderImage 		= __path_uploads + `/${controllerName}/`;

const systemConfig  	= require(__path_configs + 'system');
const MainModel 		= require(__path_models + controllerName);
const GroupsModel 		= require(__path_models + 'groups');
const MainValidate		= require(__path_validates + controllerName);
const UtilsHelpers 		= require(__path_helpers + 'utils');
const ParamsHelpers 	= require(__path_helpers + 'params');
const NotifyHelpers 	= require(__path_helpers + 'notify');
const FileHelpers 		= require(__path_helpers + 'file');
const notify  		= require(__path_configs + 'notify');



const linkIndex		 	= '/' + systemConfig.prefixAdmin + `/${controllerName}/`;
const pageTitleIndex 	= UtilsHelpers.capitalize(controllerName) + ' Management';
const pageTitleAdd   	= pageTitleIndex + ' - Add';
const pageTitleEdit  	= pageTitleIndex + ' - Edit';
const folderView	 	= __path_views_admin + `pages/${controllerName}/`;
const uploadAvatar	 	= FileHelpers.upload('avatar', controllerName);


// List users
router.get('(/status/:status)?', async (req, res, next) => {
	let params 		 = ParamsHelpers.createParams(req);
	params.groupID 	 = ParamsHelpers.getParam(req.session, 'group_id', '');
	let statusFilter = await UtilsHelpers.createFilterStatus(params, controllerName);

	let groupItems = [];
	await GroupsModel.getItems(null, {task: 'get-name-items'}).then( (items) => {
		groupItems = items;
		groupItems.unshift({_id: 'allValue', name: 'All group'});
	});

	await MainModel.countItems(params).then( (data) => {
		params.pagination.totalItems = data;
	});
	
	MainModel.listItems(params)
		.then( (items) => {
			res.render(`${folderView}list`, { 
				pageTitle: pageTitleIndex,
				items,
				statusFilter,
				groupItems,
				params
			});
		});
});

// Change status
router.get('/change-status/:id/:status', (req, res, next) => {
	let currentStatus	= ParamsHelpers.getParam(req.params, 'status', 'active'); 
	let id				= ParamsHelpers.getParam(req.params, 'id', ''); 

	MainModel.changeStatus(id, currentStatus, req.user, {tasks: 'change-one'}).then( (result) => {
		//NotifyHelpers.showNotify(req, res, linkIndex, {tasks: 'change-status-success'});
		res.json({'currentStatus': currentStatus, 'message': notify.CHANGE_STATUS_SUCCESS, 'id': id});
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
	
	MainModel.changeOrdering(cids, orderings, req.user).then( (result) => {});
	NotifyHelpers.showNotify(req, res, linkIndex, {tasks: 'change-ordering-success'});
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
router.get(('/form(/:id)?'), async (req, res, next) => {
	let id		= ParamsHelpers.getParam(req.params, 'id', '');
	let user	= {name: '', ordering: 0, status: 'allValue', content: '', group_id: '', group_name: '', username: '', password: ''};    // add group
	let errors  = null;
	let groupItems = [];
	await GroupsModel.getItems(null, {task: 'get-name-items'}).then( (items) => {
		groupItems = items;
		groupItems.unshift({_id: 'allValue', name: 'Choose group'});
	});
	if(id === '') { // ADD
		res.render(`${folderView}form`, { pageTitle: pageTitleAdd, user, groupItems, errors });
	}else { // EDIT
		MainModel.getItems(id).then( (user) =>{
			user.group_id = user.group.id;
			user.group_name = user.group.name;
			res.render(`${folderView}form`, { pageTitle: pageTitleEdit, user, groupItems, errors });
		});	
	}
});

// SAVE = ADD EDIT
router.post('/save', (req, res, next) => {
	uploadAvatar(req, res, async (errUpload) => {
		req.body = JSON.parse(JSON.stringify(req.body));
		let user = Object.assign(req.body);
		let taskCurrent = (typeof user !== "undefined" && user.id !== "") ? 'edit' : 'add';

		let errors = MainValidate.validator(req, errUpload, taskCurrent);
		if(errors.length > 0) { 
			let pageTitle = (taskCurrent === 'edit') ? pageTitleEdit : pageTitleAdd;
			if(req.file != undefined) FileHelpers.remove(folderImage, req.file.filename);

			let groupItems = [];
			await GroupsModel.getItems(null, {task: 'get-name-items'}).then( (items) => {
				groupItems = items;
				groupItems.unshift({_id: 'allValue', name: 'Choose group'});
			});
			if (taskCurrent == "edit") user.avatar = user.image_old;
			res.render(`${folderView}form`, { pageTitle, user, errors, groupItems});
		} else {
			let notifyTask = (taskCurrent === 'add') ? 'add-success' : 'edit-success';
			if(req.file == undefined){ // không có upload lại hình
				user.avatar = user.image_old;
			}else{
				user.avatar = req.file.filename;
				if(taskCurrent == "edit") FileHelpers.remove(folderImage, user.image_old);
			}

			MainModel.saveItems(user, req.user, {tasks: taskCurrent}).then( (result) => {
				NotifyHelpers.showNotify(req, res, linkIndex, {tasks: notifyTask});
			});
		}
	});
});

// SORT
router.get(('/sort/:sort_field/:sort_type'), (req, res, next) => {
	req.session.sort_field		= ParamsHelpers.getParam(req.params, 'sort_field', 'ordering');
	req.session.sort_type		= ParamsHelpers.getParam(req.params, 'sort_type', 'asc');
	res.redirect(linkIndex);
});

// FILTER-GROUP
router.get(('/filter-group/:group_id'), (req, res, next) => {
	req.session.group_id		= ParamsHelpers.getParam(req.params, 'group_id', '');
	res.redirect(linkIndex);
});

module.exports = router;
