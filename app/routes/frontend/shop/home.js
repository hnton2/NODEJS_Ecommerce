var express = require('express');
var router = express.Router();

const SliderModel = require(__path_models + 'slider');
const BannerModel = require(__path_models + 'banner');
const ShoesModel = require(__path_models + 'shoes');
const ClothingModel = require(__path_models + 'clothing');
const AccessoryModel = require(__path_models + 'accessory');
const ArticleModel = require(__path_models + 'news');
const SubscribeModel = require(__path_models + 'subscribe');
const BrandModel = require(__path_models + 'brand');
const EventsModel = require(__path_models + 'events');

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
  let specialNews = [];
  let specialAccessory = [];
  let specialClothing = [];
  let itemEvents = [];
  let lastedNews = [];

  // slider
  await SliderModel.listItemsFrontend().then( (items) => {itemsSlider = items;});
  // all shoes
  await ShoesModel.listItemsFrontend(null, {task:'items-random'}).then( (items) => {lastedShoes = items;});
  // Special
  await AccessoryModel.listItemsFrontend(null, {task: 'items-special'}).then( (items) => {specialAccessory = items;});
  // Special shoes
  await ArticleModel.listItemsFrontend(null, {task: 'items-special'}).then( (items) => {specialNews = items;});
  // Special clothing
  await ClothingModel.listItemsFrontend(null, {task: 'items-special'}).then( (items) => {specialClothing = items;});
  // Event
  await EventsModel.listItemsFrontend().then( (items) => {itemEvents = items[0];});

  res.render(`${folderView}index`, {
    pageTitle : 'Home',
    top_post: true,
    contact_layout: false,
    layout: layoutShop,
    itemsSlider,
    lastedShoes,
    specialNews,
    specialAccessory,
    specialClothing,
    itemEvents,
  });
});

router.get('/event-shoes', async (req, res, next) => {
  let event = [];
  let items = [];
  await EventsModel.listItemsFrontend().then( (data) => {event = data[0];});
  if(event.type === 'shoes') await ShoesModel.getItemsBySlug(event.slug).then( (data) => { items = data; })
  else if(event.type === 'clothing') await ClothingModel.getItemsBySlug(event.slug).then( (data) => { items = data; })  
  else await AccessoryModel.getItemsBySlug(event.slug).then( (data) => { items = data; })
  items.push({expiration_date: event.expiration_date, type: event.type, thumb: event.thumb});
  res.json(items)
});

router.get('/all-brand-product', async (req, res, next) => {
  let items = [];
  await BrandModel.getItems(null, {task:'get-logo-items'}).then( (data) => {items = data;});
  res.json(items)
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
  let arrName = [];
  await ShoesModel.getNameOfItems().then( (data) => { data.forEach( (item) => { arrName.push(item.name); }); });
  await ClothingModel.getNameOfItems().then( (data) => { data.forEach( (item) => { arrName.push(item.name); }); });
  await AccessoryModel.getNameOfItems().then( (data) => { data.forEach( (item) => { arrName.push(item.name); }); });
  res.json(arrName)
});

router.get('/ads-banner', async (req, res, next) => {
  let items = [];
  await BannerModel
        .listItemsFrontend()
        .then( (data) => { items = data;});
  res.json(items)
});

router.get('/lasted-news', async (req, res, next) => {
  let items = [];
  await ArticleModel
    .listItemsFrontend(null, {task: 'items-news'})
    .then( (data) => {items = data;});
  res.json(items)
});

router.get('/best-shoes', async (req, res, next) => {
  let items = [];
  await ShoesModel
        .listItemsFrontend(null, {task: 'best-sellers-items'})
        .then( (data) => { items = data;});
  res.json(items)
});

module.exports = router;
