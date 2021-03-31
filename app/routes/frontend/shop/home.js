var express = require('express');
var router = express.Router();

const SliderModel = require(__path_models + 'slider');
const ShoesModel = require(__path_models + 'shoes');
const ArticleModel = require(__path_models + 'articles');

const folderView	 = __path_views_shop + 'pages/home/';
const layoutShop    = __path_views_shop + 'frontend';

/* GET home page. */
router.get('/', async (req, res, next) => {
  let itemsSlider = [];
  let lastedShoes = [];
  let lastedNews = [];
  let SpecialNews = [];

  // slider
  await SliderModel.listItemsFrontend().then( (items) => {itemsSlider = items;});
  // all shoes
  await ShoesModel.listItemsFrontend(null, {task:'new-items'}).then( (items) => {lastedShoes = items;});
  // Special
  await ArticleModel.listItemsFrontend(null, {task: 'items-special'}).then( (items) => {SpecialNews = items;});
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
    SpecialNews,
    lastedNews
  });
});


router.get('/get-special-shoes', async (req, res, next) => {
  let items = [];
  await ShoesModel.listItemsFrontend(null, {task:'items-special'}).then( (item) => {items = item;});
  res.json(items);
});

module.exports = router;
