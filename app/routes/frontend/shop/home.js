var express = require('express');
var router = express.Router();

const SliderModel = require(__path_models + 'slider');
const BannerModel = require(__path_models + 'banner');
const ShoesModel = require(__path_models + 'shoes');
const ClothingModel = require(__path_models + 'clothing');
const AccessoryModel = require(__path_models + 'accessory');
const ArticleModel = require(__path_models + 'articles');
const SubscribeModel = require(__path_models + 'subscribe');
const BrandModel = require(__path_models + 'brand');
const ParamsHelpers 	= require(__path_helpers + 'params');
const notify = require(__path_configs + 'notify');
const systemConfig  	= require(__path_configs + 'system');
const StringHelpers 		= require(__path_helpers + 'string');

const linkIndex		 	= StringHelpers.formatLink('/' + systemConfig.prefixShop + '/');
const folderView	 = __path_views_shop + 'pages/home/';
const layoutShop    = __path_views_shop + 'frontend';

/* GET home page. */
router.get('/', async (req, res, next) => {
  let itemsSlider = [];
  let lastedShoes = [];
  let lastedNews = [];
  let specialNews = [];
  let specialAccessory = [];
  let specialClothing = [];
  let itemsBanner = [];
  let itemBrand = [];

  // slider
  await SliderModel.listItemsFrontend().then( (items) => {itemsSlider = items;});
  // banner
  await BannerModel.listItemsFrontend().then( (items) => {itemsBanner = items;});
  // all shoes
  await ShoesModel.listItemsFrontend(null, {task:'items-random'}).then( (items) => {lastedShoes = items;});
  // Special
  await AccessoryModel.listItemsFrontend(null, {task: 'items-special'}).then( (items) => {specialAccessory = items;});
  // Special shoes
  await ArticleModel.listItemsFrontend(null, {task: 'items-special'}).then( (items) => {specialNews = items;});
  // Special clothing
  await ClothingModel.listItemsFrontend(null, {task: 'items-special'}).then( (items) => {specialClothing = items;});
  // all news
  await ArticleModel.listItemsFrontend(null, {task:'items-news'}).then( (items) => {lastedNews = items;});

  await BrandModel.getItems(null, {task:'get-logo-items'}).then( (items) => {itemBrand = items;});

  res.render(`${folderView}index`, {
    pageTitle : 'Home',
    top_post: true,
    contact_layout: false,
    sidebar_rss: false,
    layout: layoutShop,
    itemsSlider,
    lastedShoes,
    specialNews,
    lastedNews,
    specialAccessory,
    specialClothing,
    itemsBanner,
    itemBrand
  });
});

router.get('/search', async (req, res, next) => {
  let keyword 	= ParamsHelpers.getParam(req.query, 'keyword', '');
  res.redirect(linkIndex +  'trademark?search=' + keyword);
});

router.post('/subscribe', async (req, res, next) => {
  req.body = JSON.parse(JSON.stringify(req.body));
	let item = Object.assign(req.body); 
	SubscribeModel.saveItems(item, null).then( (result) => {
    res.json({'message': notify.SUBSCRIBE_SUCCESS});
	});
});

router.get('/all-name-product', async (req, res, next) => {
  arrName = [];
  await ShoesModel.getNameOfItems().then( (data) => { data.forEach( (item) => { arrName.push(item.name); }); });
  await ClothingModel.getNameOfItems().then( (data) => { data.forEach( (item) => { arrName.push(item.name); }); });
  await AccessoryModel.getNameOfItems().then( (data) => { data.forEach( (item) => { arrName.push(item.name); }); });
  res.json(arrName)
});


module.exports = router;
