var express = require('express');
var router = express.Router();

const ShoesModel = require(__path_models + 'shoes');
const CategoryModel = require(__path_models + 'product-category');

const ParamsHelpers 	= require(__path_helpers + 'params');

const folderView	 = __path_views_shop + 'pages/category/';
const layoutShop    = __path_views_shop + 'frontend';

router.get('/', async (req, res, next) => {
  let params 		 = ParamsHelpers.createParamsFrontend(req);
  let titlePage = 'All Shoes';
  let items = [];
	let slugCategory 	= ParamsHelpers.getParam(req.query, 'slug', 'all');
  if(slugCategory !== 'all') { 
    await CategoryModel.getItems({slug: slugCategory}, {task: 'get-items-by-slug'}).then( (items) => {params.categoryID = items[0].id; titlePage = items[0].name;}); 
  }
  await ShoesModel.listItemsInCategory(params).then( (item) => {items = item;});
  res.render(`${folderView}index`, { 
    pageTitle : titlePage,
    top_post: false,
    contact_layout: false,
    sidebar_rss: false,
    layout: layoutShop,
    items,
  });
});

router.get('/new-releases', async (req, res, next) => {
  await ShoesModel.listItemsFrontend(null, {task:'new-items'}).then( (item) => {items = item;});
  res.render(`${folderView}index`, { 
    pageTitle : 'New Releases',
    top_post: false,
    contact_layout: false,
    sidebar_rss: false,
    layout: layoutShop,
    items,
  });
});


router.get('/most-popular', async (req, res, next) => {
  await ShoesModel.listItemsFrontend(null, {task:'popular-items'}).then( (item) => {items = item;});
  res.render(`${folderView}index`, { 
    pageTitle : 'New Releases',
    top_post: false,
    contact_layout: false,
    sidebar_rss: false,
    layout: layoutShop,
    items,
  });
});

module.exports = router;
