var express = require('express');
var router = express.Router();

const ShoesModel = require(__path_models + 'shoes');
const CategoryModel = require(__path_models + 'product-category');
const ParamsHelpers 	= require(__path_helpers + 'params');

const folderView	 = __path_views_shop + 'pages/category/';
const layoutShop    = __path_views_shop + 'frontend';

router.get('/:slug/:sort?', async (req, res, next) => {
  let slugCategory = ParamsHelpers.getParam(req.params, 'slug', '');
  let sort		= ParamsHelpers.getParam(req.params, 'sort', 'name-asc');

  let params = {};
  params.sortType = sort.split('-')[1];
  params.sortField = sort.split('-')[0];
  let titleCategory = '';
  let itemsInCategory = [];

  if(slugCategory !== 'all') {
    console.log(slugCategory);
    // find id of category
    await CategoryModel.getItems({slug: slugCategory}, {task: 'get-items-by-slug'}).then( (items) => {params.id = items[0].id; titleCategory = items[0].name;});
    // Article in Category
    await ShoesModel.listItemsInCategory(params, {task: 'items-category'}).then( (items) => {itemsInCategory = items;});
  } else {
    titleCategory = 'All Shoes';
    await ShoesModel.listItemsInCategory(params, {task: 'all-items'}).then( (items) => {itemsInCategory = items;});
  }
  res.render(`${folderView}index`, { 
    pageTitle : titleCategory,
    top_post: false,
    contact_layout: false,
    sidebar_rss: false,
    layout: layoutShop,
    itemsInCategory,
  });
});

router.get('/filter-category/:min-:max', async (req, res, next) => {
  let itemsInCategory = [];
  let minPrice = ParamsHelpers.getParam(req.params, 'min', '');
  let maxPrice = ParamsHelpers.getParam(req.params, 'max', '');
  await ShoesModel.listItemsFrontend({min: minPrice, max: maxPrice}, {task: 'filter-price'}).then( (items) => {itemsInCategory = items;});
  res.render(`${folderView}index`, { 
    pageTitle : 'Shoes',
    top_post: false,
    contact_layout: false,
    sidebar_rss: false,
    layout: layoutShop,
    itemsInCategory
  });
});

// SORT
/* router.get(('/sort/:sort_field/:sort_type'), (req, res, next) => {
	req.session.sort_field		= ParamsHelpers.getParam(req.params, 'sort_field', 'ordering');
	req.session.sort_type		  = ParamsHelpers.getParam(req.params, 'sort_type', 'asc');
	res.redirect(linkIndex);
}); */
module.exports = router;
