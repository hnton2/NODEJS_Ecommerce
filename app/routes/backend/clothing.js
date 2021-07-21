var express = require('express');
var router 	= express.Router();

const controllerName 	= 'clothing';
const folderImage 		= __path_uploads + `/${controllerName}/`;

const systemConfig  	= require(__path_configs + 'system');
const MainModel 		= require(__path_models + controllerName);
const CategoryModel 	= require(__path_models + 'clothing-category');
const BrandModel 		= require(__path_models + 'brand');
const MainValidate		= require(__path_validates + controllerName);
const UtilsHelpers 		= require(__path_helpers + 'utils');
const ParamsHelpers 	= require(__path_helpers + 'params');
const NotifyHelpers 	= require(__path_helpers + 'notify');
const FileHelpers 		= require(__path_helpers + 'file');
const StringHelpers 		= require(__path_helpers + 'string');
const notify  			= require(__path_configs + 'notify');

const linkIndex		 	= '/' + systemConfig.prefixAdmin + `/${controllerName}/`;
const pageTitleIndex 	= UtilsHelpers.capitalize(controllerName) + ' Management';
const pageTitleAdd   	= pageTitleIndex + ' - Add';
const pageTitleEdit  	= pageTitleIndex + ' - Edit';
const folderView	 	= __path_views_admin + `pages/${controllerName}/`;
const uploadAvatar	 	= FileHelpers.uploadMulti('thumb', controllerName);

// List users
router.get('(/status/:status)?', async (req, res, next) => {
	let params 		 		= ParamsHelpers.createParams(req);
	params.categoryID 	 	= ParamsHelpers.getParam(req.session, 'category_id', '');
	params.brandID 	 	= ParamsHelpers.getParam(req.session, 'brand_id', '');
	let statusFilter 		= await UtilsHelpers.createFilterStatus(params, controllerName);

	let categoryItems = [];
	await CategoryModel.getItems(null, {task: 'get-name-items'}).then( (items) => {
		categoryItems = items;
		categoryItems.unshift({_id: 'allValue', name: 'All category'});
	});

	let brandItems = [];
	await BrandModel.getItems(null, {task: 'get-name-items'}).then( (items) => {
		brandItems = items;
		brandItems.unshift({_id: 'allValue', name: 'All brand'});
	});

	await MainModel.countItems(params, {task: 'all-items-server'}).then( (data) => {
		params.pagination.totalItems = data;
	});
	MainModel.listItems(params)
		.then( (items) => {
			res.render(`${folderView}list`, { 
				pageTitle: pageTitleIndex,
				items,
				statusFilter,
				categoryItems,
				brandItems,
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

// Change special
router.get('/change-special/:id/:special', (req, res, next) => {
	let currentStatus	= ParamsHelpers.getParam(req.params, 'special', 'active'); 
	let id				= ParamsHelpers.getParam(req.params, 'id', ''); 

	MainModel.changeSpecial(id, currentStatus, req.user, {tasks: 'change-one'}).then( (result) => {
		//NotifyHelpers.showNotify(req, res, linkIndex, {tasks: 'change-special-success'});
		res.json({'currentStatus': currentStatus, 'message': notify.CHANGE_STATUS_SUCCESS, 'id': id});
	});
});

// Change special - Multi
router.post('/change-special/:special', (req, res, next) => {
	let currentSpecial	= ParamsHelpers.getParam(req.params, 'special', 'active'); 
	
	MainModel.changeSpecial(req.body.cid, currentSpecial, req.user, {tasks: 'change-multi'}).then( (result) => {
		NotifyHelpers.showNotify(req, res, linkIndex, {n: result.n, tasks: 'change-special-multi-success'});
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
router.get('/delete/:id', async (req, res, next) => {
	let id				= ParamsHelpers.getParam(req.params, 'id', '');
	let idCategory = '';
	let idBrand = '';
	await MainModel.getItems(id, null).then( (item) => { idCategory = item.category.id; idBrand = item.brand.id;});
	await BrandModel.updateAmountOfItem(idBrand, -1).then( (result) => { }); 
	await CategoryModel.updateAmountOfItem(idCategory, -1).then( (result) => { });
	MainModel.deleteItems(id, {tasks: 'delete-one'}).then( (result) => {
		NotifyHelpers.showNotify(req, res, linkIndex, {tasks: 'delete-success'});
	});
});

// Delete - Multi
router.post('/delete', (req, res, next) => {
	let id = req.body.cid;
	id.forEach( async (i) => {
		let idCategory = '';
		let idBrand = '';
		await MainModel.getItems(i, null).then( (item) => { idCategory = item.category.id; idBrand = item.brand.id;});
		await BrandModel.updateAmountOfItem(idBrand, -1).then( (result) => { }); 
		await CategoryModel.updateAmountOfItem(idCategory, -1).then( (result) => { });
	});
	MainModel.deleteItems(id, {tasks: 'delete-multi'}).then( (result) => {
		NotifyHelpers.showNotify(req, res, linkIndex, {n: result.n, tasks: 'delete-multi-success'});
	});
});

// FORM
router.get(('/form(/:id)?'), async (req, res, next) => {
	let id		= ParamsHelpers.getParam(req.params, 'id', '');
	let product	= {name: '', slug: '', brand: '', ordering: 0, status: 'allValue', special: 'allValue', 
					content: '', category_id: '', category_name: '', brand_id: '', brand_name: '', quantity: 0,
					 price: 0, sale_off: 0, size: '', color: '', tags: ''};
	let errors  = null;
	let categoryItems = [];
	await CategoryModel.getItems(null, {task: 'get-name-items'}).then( (items) => {
		categoryItems = items;
		categoryItems.unshift({_id: 'allValue', name: 'Choose category'});
	});
	let brandItems = [];
	await BrandModel.getItems(null, {task: 'get-name-items'}).then( (items) => {
		brandItems = items;
		brandItems.unshift({_id: 'allValue', name: 'Choose brand'});
	});
	if(id === '') { // ADD
		res.render(`${folderView}form`, { pageTitle: pageTitleAdd, product, categoryItems, brandItems, errors });
	}else { // EDIT
		MainModel.getItems(id).then( (product) =>{
			product.category_id = product.category.id; 
			product.category_name = product.category.name;
			product.brand_id = product.brand.id;
			product.brand_name = product.brand.name;
			res.render(`${folderView}form`, { pageTitle: pageTitleEdit, product, categoryItems, brandItems, errors });
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
			if(req.files != undefined) {		// xóa hình khi form chưa hợp lệ
				for(let idx = 0; idx < req.files.length; idx++) {
					FileHelpers.remove(folderImage, req.files[idx].filename);
				}
			}
			let categoryItems = [];
			await CategoryModel.getItems(null, {task: 'get-name-items'}).then( (items) => {
				categoryItems = items;
				categoryItems.unshift({_id: 'allValue', name: 'Choose category'});
			});
			let brandItems = [];
			await BrandModel.getItems(null, {task: 'get-name-items'}).then( (items) => {
				brandItems = items;
				brandItems.unshift({_id: 'allValue', name: 'Choose brand'});
			});
 			if (taskCurrent == "edit") product.thumb = StringHelpers.getNameImage(product.thumb_old);	// cần sửa lại
			res.render(`${folderView}form`, { pageTitle, product, errors, categoryItems, brandItems});
		} else {
			let notifyTask = (taskCurrent === 'add') ? 'add-success' : 'edit-success';
			if(req.files.length <= 0){ // không có upload lại hình - chỉ edit thông tin
				product.thumb = StringHelpers.getNameImage(product.thumb_old);
			} else {	// edit lại thumb
				let arrayThumb = [];
				for(let idx = 0; idx < req.files.length; idx++) {
					arrayThumb.push(req.files[idx].filename);
				}
				product.thumb = arrayThumb;
				let thumbOldArray = StringHelpers.getNameImage(product.thumb_old);
				if(taskCurrent == "edit") {
					for(let i = 0; i < thumbOldArray.length; i++) {
						FileHelpers.remove(folderImage, thumbOldArray[i]);
					}
				}
			}
			if(req.files.length > 0){
				let arrayThumb = [];
				for(let idx = 0; idx < req.files.length; idx++) {
					arrayThumb.push(req.files[idx].filename);
				}
				product.thumb = arrayThumb;
			}
			if(taskCurrent == 'add') {
				await BrandModel.updateAmountOfItem(product.brand_id, 1).then( (result) => { }); 
				await CategoryModel.updateAmountOfItem(product.category_id, 1).then( (result) => { });
			} else if (taskCurrent == 'edit') {
				if(product.brandID_old != product.brand_id) { // cập nhật category
					await BrandModel.updateAmountOfItem(product.brandID_old, -1).then( (result) => { });
					await BrandModel.updateAmountOfItem(product.brand_id, 1).then( (result) => { });
				}
				if(product.categoryID_old != product.category_id) { // cập nhật category
					await CategoryModel.updateAmountOfItem(product.categoryID_old, -1).then( (result) => { });
					await CategoryModel.updateAmountOfItem(product.category_id, 1).then( (result) => { });
				}
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

// FILTER-BRAND
router.get(('/filter-brand/:brand_id'), (req, res, next) => {
	req.session.brand_id		= ParamsHelpers.getParam(req.params, 'brand_id', '');
	res.redirect(linkIndex);
});

module.exports = router;
