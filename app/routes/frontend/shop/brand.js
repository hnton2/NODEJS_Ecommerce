var express = require('express');
var router = express.Router();

const ShoesModel = require(__path_models + 'shoes');
const ClothingModel = require(__path_models + 'clothing');
const AccessoryModel = require(__path_models + 'accessory');
const BrandModel = require(__path_models + 'brand');
const ParamsHelpers 	= require(__path_helpers + 'params');

const folderView	 = __path_views_shop + 'pages/brand/';
const layoutShop    = __path_views_shop + 'frontend';

router.get('/', async (req, res, next) => {
  let params 		 = ParamsHelpers.createParamsFrontend(req);
  let titlePage = 'Brand';
  let itemsShoes = [];
  let itemsClothing = [];
  let itemsAccessory = [];
  let slugBrand 	  = ParamsHelpers.getParam(req.query, 'brand', 'all');
  if(slugBrand !== 'all') { await BrandModel.getItems({slug: slugBrand}, {task: 'get-items-by-slug'}).then( (items) => {params.brandID = items[0].id; titlePage = items[0].name;}); }
  await ShoesModel.listItemsInCategory(params).then( (item) => {itemsShoes = item;});
  await ClothingModel.listItemsInCategory(params).then( (item) => {itemsClothing = item;});
  await AccessoryModel.listItemsInCategory(params).then( (item) => {itemsAccessory = item;});
  res.render(`${folderView}index`, { 
    pageTitle : titlePage,
    top_post: false,
    contact_layout: false,
    sidebar_rss: false,
    layout: layoutShop,
    itemsAccessory,
    itemsClothing,
    itemsShoes,
  });
});

module.exports = router;
