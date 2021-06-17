var express = require('express');
var router = express.Router();

const ShoesModel = require(__path_models + 'shoes');
const ClothingModel = require(__path_models + 'clothing');
const AccessoryModel = require(__path_models + 'accessory');
const BrandModel = require(__path_models + 'brand');
const ParamsHelpers 	= require(__path_helpers + 'params');
const UtilsHelpers 		= require(__path_helpers + 'utils');

const folderView	 = __path_views_shop + 'pages/brand/';
const layoutShop    = __path_views_shop + 'frontend';

router.get('/', async (req, res, next) => {
  let params 		 = ParamsHelpers.createParamsFrontend(req);
  let titlePage = 'Brand';
  let items = [];
  let slugBrand 	  = ParamsHelpers.getParam(req.query, 'brand', 'all');
  if(slugBrand !== 'all') { await BrandModel.getItems({slug: slugBrand}, {task: 'get-items-by-slug'}).then( (items) => {params.brandID = items[0].id; titlePage = items[0].name;}); }
  await ShoesModel.listItemsInCategory(params).then( (data) => {items = items.concat(data);});
  await ClothingModel.listItemsInCategory(params).then( (data) => {items = items.concat(data);});
  await AccessoryModel.listItemsInCategory(params).then( (data) => {items = items.concat(data);});
  params.pagination.totalItems = items.length;
  items = UtilsHelpers.shuffleArray(items);
  res.render(`${folderView}index`, { 
    pageTitle : titlePage,
    top_post: false,
    contact_layout: false,
    layout: layoutShop,
    items,
    params,
    slugBrand
  });
});

module.exports = router;
