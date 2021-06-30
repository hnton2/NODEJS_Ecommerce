var express = require('express');
var router 	= express.Router();
var fs = require('fs');

const controllerName 	= 'orders';

const systemConfig  	= require(__path_configs + 'system');
const MainModel 		= require(__path_models + controllerName);
const ConfigModel 		= require(__path_models + 'config');
const UtilsHelpers 		= require(__path_helpers + 'utils');
const ParamsHelpers 	= require(__path_helpers + 'params');
const NotifyHelpers 	= require(__path_helpers + 'notify');
const notify  			= require(__path_configs + 'notify');

const linkIndex		 	= '/' + systemConfig.prefixAdmin + `/${controllerName}/`;
const pageTitleIndex 	= UtilsHelpers.capitalize(controllerName) + ' Management';
const folderView	 	= __path_views_admin + `pages/${controllerName}/`;

// List items
router.get('(/status/:status)?', async (req, res, next) => {
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

// Change status
router.post('/change-progress/:id/:status', (req, res, next) => {
	let currentStatus	= ParamsHelpers.getParam(req.params, 'status', 'confirming'); 
	let id				= ParamsHelpers.getParam(req.params, 'id', ''); 
	
	MainModel.changeProgress(id, currentStatus).then( (result) => {
		// NotifyHelpers.showNotify(req, res, linkIndex, {tasks: 'change-status-success'}); 
		res.json({'currentStatus': currentStatus, 'message': notify.CHANGE_STATUS_SUCCESS, 'id': id});
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
router.get(('/form(/:id)?'), async (req, res, next) => {
	let id		= ParamsHelpers.getParam(req.params, 'id', '');
	let errors   = null;
	let infoConfig = [];
	await ConfigModel.getItems().then( (items) => {infoConfig = items[0]})
	MainModel.getItems({id: id}, {task: 'get-items-by-id'}).then( (item) =>{
		res.render(`${folderView}form`, { pageTitle: 'Invoice #' + item.code, item, infoConfig, errors});
	});
});

// INVOICE PRINT
router.get(('/print/:id'), async (req, res, next) => {
	let id		= ParamsHelpers.getParam(req.params, 'id', '');
	let errors   = null;
	let infoConfig = [];
	await ConfigModel.getItems().then( (items) => {infoConfig = items[0]})
	MainModel.getItems({id: id}, {task: 'get-items-by-id'}).then( (item) =>{
		res.render(`${folderView}invoice-print`, { layout: false, pageTitle: 'Invoice #' + item.code, item, infoConfig, errors});
	});
});

// SORT
router.get(('/sort/:sort_field/:sort_type'), (req, res, next) => {
	req.session.sort_field		= ParamsHelpers.getParam(req.params, 'sort_field', 'ordering');
	req.session.sort_type		= ParamsHelpers.getParam(req.params, 'sort_type', 'asc');
	res.redirect(linkIndex);
});

module.exports = router;
