var express = require('express');
var router = express.Router();

const ShoesModel = require(__path_models + 'shoes');
const ShoesCategoryModel = require(__path_models + 'shoes-category');
const ClothingModel = require(__path_models + 'clothing');
const ClothingCategoryModel = require(__path_models + 'clothing-category');
const AccessoryModel = require(__path_models + 'accessory');
const AccessoryCategoryModel = require(__path_models + 'accessory-category');
const BrandModel = require(__path_models + 'brand');
const ParamsHelpers 	= require(__path_helpers + 'params');
const folderView	 = __path_views_shop + 'pages/category/';
const layoutShop    = __path_views_shop + 'frontend';
const UtilsHelpers 		= require(__path_helpers + 'utils');

router.get('/shoes', async (req, res, next) => {
  let params 		 = ParamsHelpers.createParamsFrontend(req);
  let titlePage = 'Shoes';
  let items = [];
  if(params.category !== 'all') { await ShoesCategoryModel.getItems({slug: params.category}, {task: 'get-items-by-slug'}).then( (items) => {params.categoryID = items[0].id; titlePage = items[0].name;}); }
  if(params.brand !== 'all') { await BrandModel.getItems({slug: params.brand}, {task: 'get-items-by-slug'}).then( (items) => {params.brandID = items[0].id; titlePage = items[0].name;}); }
  await ShoesModel.countItems(params, {task: 'all-items'}).then( (data) => { params.pagination.totalItems = data; })
  await ShoesModel.listItemsInCategory(params).then( (item) => {items = item;});
  res.render(`${folderView}index`, { 
    pageTitle : titlePage,
    top_post: false,
    contact_layout: false,
    layout: layoutShop,
    items,
    params,
  });
});

router.get('/clothing', async (req, res, next) => {
  let params 		 = ParamsHelpers.createParamsFrontend(req);
  let titlePage = 'Clothing';
  let items = [];
  if(params.category !== 'all') { await ClothingCategoryModel.getItems({slug: params.category}, {task: 'get-items-by-slug'}).then( (items) => {params.categoryID = items[0].id; titlePage = items[0].name;}); }
  if(params.brand !== 'all') { await BrandModel.getItems({slug: params.brand}, {task: 'get-items-by-slug'}).then( (items) => {params.brandID = items[0].id; titlePage = items[0].name;}); }
  await ClothingModel.countItems(params, {task: 'all-items'}).then( (data) => { params.pagination.totalItems = data; })
  await ClothingModel.listItemsInCategory(params).then( (item) => {items = item;});
  res.render(`${folderView}index-2`, { 
    pageTitle : titlePage,
    top_post: false,
    contact_layout: false,
    layout: layoutShop,
    items,
    params,
  });
});

router.get('/accessory', async (req, res, next) => {
  let params 		 = ParamsHelpers.createParamsFrontend(req);
  let titlePage = 'Accessories & Equipment';
  let items = [];
  if(params.category !== 'all') { await AccessoryCategoryModel.getItems({slug: params.category}, {task: 'get-items-by-slug'}).then( (items) => {params.categoryID = items[0].id; titlePage = items[0].name;}); }
  if(params.brand !== 'all') { await BrandModel.getItems({slug: params.brand}, {task: 'get-items-by-slug'}).then( (items) => {params.brandID = items[0].id; titlePage = items[0].name;}); }
  await AccessoryModel.countItems(params, {task: 'all-items'}).then( (data) => { params.pagination.totalItems = data; })
  await AccessoryModel.listItemsInCategory(params).then( (item) => {items = item;});
  res.render(`${folderView}index-3`, { 
    pageTitle : titlePage,
    top_post: false,
    contact_layout: false,
    layout: layoutShop,
    items,
    params,
  });
});


router.get('/trademark', async (req, res, next) => {
  let params 		 = ParamsHelpers.createParamsFrontend(req);
  let titlePage = 'Brand';
  let items = [];

  if(params.brand !== 'all') { await BrandModel.getItems({slug: params.brand}, {task: 'get-items-by-slug'}).then( (items) => {params.brandID = items[0].id; titlePage = items[0].name;}); }
  
  await ShoesModel.listItemsInCategory2(params).then( (data) => {items = items.concat(data);});
  await ClothingModel.listItemsInCategory2(params).then( (data) => {items = items.concat(data);});
  await AccessoryModel.listItemsInCategory2(params).then( (data) => {items = items.concat(data);});
  let pagination 	 = {
		totalItems		 : 1,
		totalItemsPerPage: 20,
		currentPage		 : parseInt(ParamsHelpers.getParam(req.query, 'page', 1)),
		pageRanges		 : 3,
    totalItems: items.length
	};
  items = items.slice((pagination.currentPage - 1) * pagination.totalItemsPerPage, pagination.currentPage * pagination.totalItemsPerPage);
  items = UtilsHelpers.shuffleArray(items);
  res.render(`${folderView}index-4`, { 
    pageTitle : titlePage,
    top_post: false,
    contact_layout: false,
    layout: layoutShop,
    items,
    params,
    pagination,
  });
});

module.exports = router;