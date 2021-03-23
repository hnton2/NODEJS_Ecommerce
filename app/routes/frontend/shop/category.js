var express = require('express');
var router = express.Router();

const ShoesModel = require(__path_models + 'shoes');
const CategoryModel = require(__path_models + 'product-category');
const ParamsHelpers 	= require(__path_helpers + 'params');

const folderView	 = __path_views_shop + 'pages/category/';
const layoutShop    = __path_views_shop + 'frontend';


/* GET home page. */
router.get('/(:slug)?', async (req, res, next) => {
  let slugCategory = ParamsHelpers.getParam(req.params, 'slug', '');
  let idCategory = '';
  let titleCategory = '';
  let itemsInCategory = [];
  if(slugCategory !== '') {
    // find id of category
    await CategoryModel.getItems({slug: slugCategory}, {task: 'get-items-by-slug'}).then( (items) => {idCategory = items[0].id; titleCategory = items[0].name});
    // Article in Category
    await ShoesModel.listItemsFrontend({id: idCategory}, {task: 'items-in-category'}).then( (items) => {itemsInCategory = items;});
  } else {
    titleCategory = 'All Shoes';
    await ShoesModel.listItemsFrontend(null, {task: 'all-items'}).then( (items) => {itemsInCategory = items;});
  }
  res.render(`${folderView}index`, { 
    pageTitle : titleCategory,
    top_post: false,
    contact_layout: false,
    layout: layoutShop,
    itemsInCategory,
  });

});

module.exports = router;
