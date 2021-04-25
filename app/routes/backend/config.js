var express = require('express');
var router 	= express.Router();

const controllerName 	= 'config';
const folderImage 		= __path_uploads + `/${controllerName}/`;

const systemConfig  	= require(__path_configs + 'system');
const MainModel 		= require(__path_models + controllerName);
const GroupsModel 		= require(__path_models + 'groups');
const MainValidate		= require(__path_validates + controllerName);
const UtilsHelpers 		= require(__path_helpers + 'utils');
const ParamsHelpers 	= require(__path_helpers + 'params');
const NotifyHelpers 	= require(__path_helpers + 'notify');
const FileHelpers 		= require(__path_helpers + 'file');
const notify  			= require(__path_configs + 'notify');

const linkIndex		 	= '/' + systemConfig.prefixAdmin + `/${controllerName}/`;
const pageTitleIndex 	= UtilsHelpers.capitalize(controllerName) + ' Management';
const pageTitleAdd   	= pageTitleIndex + ' - Add';
const pageTitleEdit  	= pageTitleIndex + ' - Edit';
const folderView	 	= __path_views_admin + `pages/${controllerName}/`;
const uploadAvatar	 	= FileHelpers.upload('logo', controllerName);


// FORM
router.get(('/'), async (req, res, next) => {
	let item = [];
	let errors  = null;
	
	await MainModel.getItems().then( (data) =>{
		if(data.length < 1) {
			item.push({name_website: '', email: '', password_email: '', hotline: '', address: '', facebook: '', instagram: '', twitter: '', map: '', about: ''});
		} else {
			item = data;
		}
	});
	item = item[0];
	res.render(`${folderView}form`, { pageTitle: pageTitleEdit, item, errors });
});

// SAVE = ADD EDIT
router.post('/save', (req, res, next) => {
	uploadAvatar(req, res, async (errUpload) => {
		req.body = JSON.parse(JSON.stringify(req.body));
		let item = Object.assign(req.body);
		let taskCurrent = (typeof item !== "undefined" && item.id !== "") ? 'edit' : 'add';

		let errors = MainValidate.validator(req, errUpload, taskCurrent);
		if(errors.length > 0) { 
			let pageTitle = (taskCurrent === 'edit') ? pageTitleEdit : pageTitleAdd;
			if(req.file != undefined) FileHelpers.remove(folderImage, req.file.filename);

			if (taskCurrent == "edit") item.logo = item.image_old;
			res.render(`${folderView}form`, { pageTitle, item, errors});
		} else {
			let notifyTask = (taskCurrent === 'add') ? 'add-success' : 'edit-success';
			if(req.file == undefined){ // không có upload lại hình
				item.logo = item.image_old;
			}else{
				item.logo = req.file.filename;
				if(taskCurrent == "edit") FileHelpers.remove(folderImage, item.image_old);
			}

			MainModel.saveItems(item, req.user, {tasks: taskCurrent}).then( (result) => {
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
