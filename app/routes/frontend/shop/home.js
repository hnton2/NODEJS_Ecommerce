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
  let allItems = [];
  let itemsSpecial = [];

  // slider
  await SliderModel.listItemsFrontend().then( (items) => {itemsSlider = items;});
  // allItems
  await ShoesModel.listItemsFrontend(null, {task:'new-items'}).then( (items) => {allItems = items;});
  // Special
  await ArticleModel.listItemsFrontend(null, {task: 'items-special'}).then( (items) => {itemsSpecial = items;});

  res.render(`${folderView}index`, {
    pageTitle : 'Home',
    top_post: true,
    contact_layout: false,
    layout: layoutShop,
    itemsSlider,
    allItems,
    itemsSpecial
  });
});


router.get('/get-special-shoes', async (req, res, next) => {
  let items = [];
  await ShoesModel.listItemsFrontend(null, {task:'items-special'}).then( (item) => {items = item;});
  res.json(items);
});

module.exports = router;
