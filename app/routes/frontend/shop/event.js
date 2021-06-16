var express = require('express');
var router = express.Router();

const ShoesModel = require(__path_models + 'shoes');
const ClothingModel = require(__path_models + 'clothing');
const AccessoryModel = require(__path_models + 'accessory');
const ParamsHelpers 	= require(__path_helpers + 'params');

const systemConfig  	= require(__path_configs + 'system');
const StringHelpers 		= require(__path_helpers + 'string');
const UtilsHelpers 		= require(__path_helpers + 'utils');

const linkIndex		 	= StringHelpers.formatLink('/' + systemConfig.prefixShop + '/');
const folderView	 = __path_views_shop + 'pages/event/';
const layoutShop    = __path_views_shop + 'frontend';

/* GET home page. */
router.get('/:event', async (req, res, next) => {
  let titlePage = '';
  let items = [];

  let currentCurrent = ParamsHelpers.getParam(req.params, 'event', '');
  if(currentCurrent === 'new-releases') {
    titlePage = 'New Releases';
    taskEvent = 'new-items';
  } else if(currentCurrent === 'most-popular') { 
    titlePage = 'Most Popular';
    taskEvent = 'popular-items';
  } else if(currentCurrent === 'just-for-you') { 
    titlePage = 'Just For You';
    taskEvent = 'favorite-items';
  } else if(currentCurrent === 'highly-rated-product') { 
    titlePage = 'Highly Rated Product';
    taskEvent = 'highly-rated-items';
  } else if(currentCurrent === 'flash-sale') { 
    titlePage = 'Flash Sale';
    taskEvent = 'sale-items';
  } else if(currentCurrent === 'best-sellers') { 
    titlePage = 'Best Sellers';
    taskEvent = 'best-sellers-items';
  } else if(currentCurrent === 'trending-product') { 
    titlePage = 'Now Trending';
    taskEvent = 'items-special';
  }
  await ShoesModel.listItemsFrontend(null, {task: taskEvent}).then( (data) => {items = items.concat(data);});
  await AccessoryModel.listItemsFrontend(null, {task: taskEvent}).then( (data) => {items = items.concat(data);});
  await ClothingModel.listItemsFrontend(null, {task: taskEvent}).then( (data) => {items = items.concat(data);});

  items = UtilsHelpers.shuffleArray(items);
  res.render(`${folderView}index`, {
    pageTitle : titlePage,
    top_post: false,
    contact_layout: false,
    layout: layoutShop,
    items
  });
});

module.exports = router;
