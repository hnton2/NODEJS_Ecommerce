var express = require('express');
var router 	= express.Router();

const controllerName 	= 'products';
const folderImage 		= __path_uploads + `/${controllerName}/`;

const systemConfig  	= require(__path_configs + 'system');
const MainModel 		= require(__path_models + controllerName);
const CategoryModel 	= require(__path_models + 'product-category');
const MainValidate		= require(__path_validates + controllerName);
const UtilsHelpers 		= require(__path_helpers + 'utils');
const ParamsHelpers 	= require(__path_helpers + 'params');
const NotifyHelpers 	= require(__path_helpers + 'notify');
const FileHelpers 		= require(__path_helpers + 'file');

const linkIndex		 	= '/' + systemConfig.prefixAdmin + `/${controllerName}/`;
const pageTitleIndex 	= UtilsHelpers.capitalize(controllerName) + ' Management';
const pageTitleAdd   	= pageTitleIndex + ' - Add';
const pageTitleEdit  	= pageTitleIndex + ' - Edit';
const folderView	 	= __path_views_admin + `pages/${controllerName}/`;
const uploadAvatar	 	= FileHelpers.upload('thumb', controllerName);

// List users
router.get('(/status/:status)?', async (req, res, next) => {
	let params 		 		= ParamsHelpers.createParams(req);
	params.categoryID 	 	= ParamsHelpers.getParam(req.session, 'category_id', '');
	let statusFilter 		= await UtilsHelpers.createFilterStatus(params, controllerName);

	let categoryItems = [];
	await CategoryModel.getItems(null, {task: 'get-name-items'}).then( (items) => {
		categoryItems = items;
		categoryItems.unshift({_id: 'allValue', name: 'All category'});
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
				categoryItems,
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
	let product	= {name: '', slug: '', ordering: 0, status: 'allValue', content: '', category_id: '', category_name: ''};
	let errors  = null;
	let categoryItems = [];
	await CategoryModel.getItems(null, {task: 'get-name-items'}).then( (items) => {
		categoryItems = items;
		categoryItems.unshift({_id: 'allValue', name: 'Choose category'});
	});
	if(id === '') { // ADD
		res.render(`${folderView}form`, { pageTitle: pageTitleAdd, product, categoryItems, errors });
	}else { // EDIT
		MainModel.getItems(id).then( (article) =>{
			product.category_id = article.category.id;
			product.category_name = article.category.name;
			res.render(`${folderView}form`, { pageTitle: pageTitleEdit, product, categoryItems, errors });
		});	
	}
});

// SAVE = ADD EDIT
router.post('/save', (req, res, next) => {
	uploadAvatar(req, res, async (errUpload) => {
		req.body = JSON.parse(JSON.stringify(req.body));
		let product = Object.assign(req.body);
		let taskCurrent = (typeof product !== "undefined" && product.id !== "") ? 'edit' : 'add';

		let errors = MainValidate.validator(req, errUpload, taskCurrent);
		if(errors.length > 0) { 
			let pageTitle = (taskCurrent === 'edit') ? pageTitleEdit : pageTitleAdd;
			if(req.file != undefined) FileHelpers.remove(folderImage, req.file.filename);

			let categoryItems = [];
			await CategoryModel.getItems(null, {task: 'get-name-items'}).then( (items) => {
				categoryItems = items;
				categoryItems.unshift({_id: 'allValue', name: 'Choose category'});
			});
			if (taskCurrent == "edit") product.thumb = product.thumb_old;
			res.render(`${folderView}form`, { pageTitle, product, errors, categoryItems});
		} else {
			let notifyTask = (taskCurrent === 'add') ? 'add-success' : 'edit-success';
			if(req.file == undefined){ // không có upload lại hình
				product.thumb = product.thumb_old;
			}else{
				product.thumb = req.file.filename;
				if(taskCurrent == "edit") FileHelpers.remove(folderImage, product.thumb_old);
			}

			MainModel.saveItems(product, req.user, {tasks: taskCurrent}).then( (result) => {
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

// FILTER-CATEGORY
router.get(('/filter-category/:category_id'), (req, res, next) => {
	req.session.category_id		= ParamsHelpers.getParam(req.params, 'category_id', '');
	res.redirect(linkIndex);
});

module.exports = router;
