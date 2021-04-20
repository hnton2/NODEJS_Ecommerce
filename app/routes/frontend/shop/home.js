var express = require('express');
var router = express.Router();

const SliderModel = require(__path_models + 'slider');
const BannerModel = require(__path_models + 'banner');
const ShoesModel = require(__path_models + 'shoes');
const ArticleModel = require(__path_models + 'articles');
const SubscribeModel = require(__path_models + 'subscribe');
const notify = require(__path_configs + 'notify');

const folderView	 = __path_views_shop + 'pages/home/';
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
  await ShoesModel.listItemsFrontend(null, {task:'all-items'}).then( (items) => {lastedShoes = items;});
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


module.exports = router;
