var express = require('express');
var router = express.Router();

const SliderModel = require(__path_models + 'slider');
const BannerModel = require(__path_models + 'banner');
const ShoesModel = require(__path_models + 'shoes');
const ArticleModel = require(__path_models + 'articles');
const SubscribeModel = require(__path_models + 'subscribe');
const notify = require(__path_configs + 'notify');
const CategoryModel = require(__path_models + 'product-category');
const ParamsHelpers 	= require(__path_helpers + 'params');

const folderView	 = __path_views_shop + 'pages/home/';
const folderView2	 = __path_views_shop + 'pages/category/';
const layoutShop    = __path_views_shop + 'frontend';

/* GET home page. */
router.get('/', async (req, res, next) => {
  let itemsSlider = [];
  let lastedShoes = [];
  let lastedNews = [];
  let specialNews = [];
  let specialShoes = [];
  let itemsBanner = [];

  // slider
  await SliderModel.listItemsFrontend().then( (items) => {itemsSlider = items;});
  // banner
  await BannerModel.listItemsFrontend().then( (items) => {itemsBanner = items;});
  // all shoes
  await ShoesModel.listItemsFrontend(null, {task:'new-items'}).then( (items) => {lastedShoes = items;});
  // Special
  await ShoesModel.listItemsFrontend(null, {task: 'items-special'}).then( (items) => {specialShoes = items;});
  // Special
  await ArticleModel.listItemsFrontend(null, {task: 'items-special'}).then( (items) => {specialNews = items;});
  // all news
  await ArticleModel.listItemsFrontend(null, {task:'items-news'}).then( (items) => {lastedNews = items;});
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
    specialShoes,
    itemsBanner
  });
});


router.get('/get-special-shoes', async (req, res, next) => {
  let items = [];
  await ShoesModel.listItemsFrontend(null, {task:'items-special'}).then( (item) => {items = item;});
  res.json(items);
});

router.post('/subscribe', async (req, res, next) => {
  req.body = JSON.parse(JSON.stringify(req.body));
	let item = Object.assign(req.body); 
	SubscribeModel.saveItems(item, null).then( (result) => {
    res.json({'message': notify.SUBSCRIBE_SUCCESS});
	});
});

router.get('/category-:slug', async (req, res, next) => {
  let slugCategory = ParamsHelpers.getParam(req.params, 'slug', '');
  let idCategory = '';
  let titleCategory = '';
  let itemsInCategory = [];
  
  // find id of category
  await CategoryModel.getItems({slug: slugCategory}, {task: 'get-items-by-slug'}).then( (items) => {idCategory = items[0].id; titleCategory = items[0].name;});
  // Article in Category
  await ShoesModel.listItemsFrontend({id: idCategory}, {task: 'items-in-category'}).then( (items) => {itemsInCategory = items;});
  res.render(`${folderView2}index`, { 
    pageTitle : titleCategory,
    pageTitle : 'Shoes',
    top_post: false,
    contact_layout: false,
    sidebar_rss: false,
    layout: layoutShop,
    itemsInCategory,
  });
});

module.exports = router;
