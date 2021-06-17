var express = require('express');
var router = express.Router();

const ShoesModel = require(__path_models + 'shoes');
const ShoesCategoryModel = require(__path_models + 'product-category');
const ClothingModel = require(__path_models + 'clothing');
const ClothingCategoryModel = require(__path_models + 'clothing-category');
const AccessoryModel = require(__path_models + 'accessory');
const AccessoryCategoryModel = require(__path_models + 'accessory-category');
const BrandModel = require(__path_models + 'brand');
const ParamsHelpers 	= require(__path_helpers + 'params');
const folderView	 = __path_views_shop + 'pages/category/';
const layoutShop    = __path_views_shop + 'frontend';

router.get('/shoes', async (req, res, next) => {
  let params 		 = ParamsHelpers.createParamsFrontend(req);
  let titlePage = 'Shoes';
  let items = [];
	let slugCategory 	= ParamsHelpers.getParam(req.query, 'slug', 'all');
  let slugBrand 	  = ParamsHelpers.getParam(req.query, 'brand', 'all');
  if(slugCategory !== 'all') { await ShoesCategoryModel.getItems({slug: slugCategory}, {task: 'get-items-by-slug'}).then( (items) => {params.categoryID = items[0].id; titlePage = items[0].name;}); }
  if(slugBrand !== 'all') { await BrandModel.getItems({slug: slugBrand}, {task: 'get-items-by-slug'}).then( (items) => {params.brandID = items[0].id; titlePage = items[0].name;}); }
  await ShoesModel.countItems(params).then( (data) => { params.pagination.totalItems = data; })
  await ShoesModel.listItemsInCategory(params).then( (item) => {items = item;});
  res.render(`${folderView}index`, { 
    pageTitle : titlePage,
    top_post: false,
    contact_layout: false,
    layout: layoutShop,
    items,
    slugCategory,
    slugBrand,
    params,
  });
});

router.get('/clothing', async (req, res, next) => {
  let params 		 = ParamsHelpers.createParamsFrontend(req);
  let titlePage = 'Clothing';
  let items = [];
	let slugCategory 	= ParamsHelpers.getParam(req.query, 'slug', 'all');
  let slugBrand 	  = ParamsHelpers.getParam(req.query, 'brand', 'all');
  if(slugCategory !== 'all') { await ClothingCategoryModel.getItems({slug: slugCategory}, {task: 'get-items-by-slug'}).then( (items) => {params.categoryID = items[0].id; titlePage = items[0].name;}); }
  if(slugBrand !== 'all') { await BrandModel.getItems({slug: slugBrand}, {task: 'get-items-by-slug'}).then( (items) => {params.brandID = items[0].id; titlePage = items[0].name;}); }
  await ClothingModel.countItems(params).then( (data) => { params.pagination.totalItems = data; })
  await ClothingModel.listItemsInCategory(params).then( (item) => {items = item;});
  res.render(`${folderView}index-2`, { 
    pageTitle : titlePage,
    top_post: false,
    contact_layout: false,
    layout: layoutShop,
    items,
    slugCategory,
    slugBrand,
    params,
  });
});

router.get('/accessory', async (req, res, next) => {
  let params 		 = ParamsHelpers.createParamsFrontend(req);
  let titlePage = 'Accessories & Equipment';
  let items = [];
	let slugCategory 	= ParamsHelpers.getParam(req.query, 'slug', 'all');
  let slugBrand 	  = ParamsHelpers.getParam(req.query, 'brand', 'all');
  if(slugCategory !== 'all') { await AccessoryCategoryModel.getItems({slug: slugCategory}, {task: 'get-items-by-slug'}).then( (items) => {params.categoryID = items[0].id; titlePage = items[0].name;}); }
  if(slugBrand !== 'all') { await BrandModel.getItems({slug: slugBrand}, {task: 'get-items-by-slug'}).then( (items) => {params.brandID = items[0].id; titlePage = items[0].name;}); }
  await AccessoryModel.countItems(params).then( (data) => { params.pagination.totalItems = data; })
  await AccessoryModel.listItemsInCategory(params).then( (item) => {items = item;});
  res.render(`${folderView}index-3`, { 
    pageTitle : titlePage,
    top_post: false,
    contact_layout: false,
    layout: layoutShop,
    items,
    slugCategory,
    slugBrand,
    params,
  });
});

module.exports = router;
