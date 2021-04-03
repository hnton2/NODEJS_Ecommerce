var express = require('express');
var router = express.Router();

const ShoesModel = require(__path_models + 'shoes');
const CategoryModel = require(__path_models + 'product-category');
const ParamsHelpers 	= require(__path_helpers + 'params');

const folderView	 = __path_views_shop + 'pages/category/';
const layoutShop    = __path_views_shop + 'frontend';

router.get('/', async (req, res, next) => {
  let itemsInCategory = [];
  await ShoesModel.listItemsFrontend(null, {task: 'all-items'}).then( (items) => {itemsInCategory = items;});
  res.render(`${folderView}index`, { 
    pageTitle : 'Shoes',
    top_post: false,
    contact_layout: false,
    sidebar_rss: false,
    layout: layoutShop,
    itemsInCategory
  });

});

router.get('/all/shoes', async (req, res, next) => {
  let itemsInCategory = [];
  await ShoesModel.listItemsFrontend(null, {task: 'all-items'}).then( (items) => {itemsInCategory = items;});
  res.json(itemsInCategory);
});

router.get('/:slug', async (req, res, next) => {
  let slugCategory = ParamsHelpers.getParam(req.params, 'slug', '');
  let idCategory = '';
  let titleCategory = '';
  let itemsInCategory = [];

  // find id of category
  await CategoryModel.getItems({slug: slugCategory}, {task: 'get-items-by-slug'}).then( (items) => {idCategory = items[0].id;});
  // Article in Category
  await ShoesModel.listItemsFrontend({id: idCategory}, {task: 'items-in-category'}).then( (items) => {itemsInCategory = items;});
  
  res.json(itemsInCategory);
});

// SORT
router.get(('/sort/:sort_field/:sort_type'), (req, res, next) => {
	req.session.sort_field		= ParamsHelpers.getParam(req.params, 'sort_field', 'ordering');
	req.session.sort_type		  = ParamsHelpers.getParam(req.params, 'sort_type', 'asc');
	res.redirect(linkIndex);
});
module.exports = router;
