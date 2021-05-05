var express = require('express');
var router 	= express.Router();

const controllerName 	= 'config';
const folderImage 		= __path_uploads + `/${controllerName}/`;

const systemConfig  	= require(__path_configs + 'system');
const MainModel 		= require(__path_models + controllerName);
const MainValidate		= require(__path_validates + controllerName);
const UtilsHelpers 		= require(__path_helpers + 'utils');
const ParamsHelpers 	= require(__path_helpers + 'params');
const NotifyHelpers 	= require(__path_helpers + 'notify');
const FileHelpers 		= require(__path_helpers + 'file');

const linkIndex		 	= '/' + systemConfig.prefixAdmin + `/${controllerName}/`;
const pageTitleIndex 	= UtilsHelpers.capitalize(controllerName) + ' Management';
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
	res.render(`${folderView}form`, { pageTitle: pageTitleIndex, item, errors });
});

// SAVE = ADD EDIT
router.post('/save', (req, res, next) => {
	uploadAvatar(req, res, async (errUpload) => {
		req.body = JSON.parse(JSON.stringify(req.body));
		let item = Object.assign(req.body);
		let taskCurrent = (typeof item !== "undefined" && item.id !== "") ? 'edit' : 'add';

		let errors = MainValidate.validator(req, errUpload, taskCurrent);
		if(errors.length > 0) { 
			if(req.file != undefined) FileHelpers.remove(folderImage, req.file.filename);

			if (taskCurrent == "edit") item.logo = item.image_old;
			res.render(`${folderView}form`, { pageTitle: pageTitleIndex, item, errors});
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

module.exports = router;
