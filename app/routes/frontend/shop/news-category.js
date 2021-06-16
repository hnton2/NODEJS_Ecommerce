var express = require('express');
var router = express.Router();

const ParamsHelpers 	= require(__path_helpers + 'params');

const ArticleModel = require(__path_models + 'articles');
const CategoryModel = require(__path_models + 'category');
const ShoesModel = require(__path_models + 'shoes');

const folderView	 = __path_views_shop + 'pages/news-category/';
const layoutShop    = __path_views_shop + 'frontend';

router.get('/:category/', async (req, res, next) => {
  let title = '';
  let taskCategory = '';
  let objWhere = {};
  let itemsInCategory = [];
  let categorySlug = ParamsHelpers.getParam(req.params, 'category', '');
  let keyword		 = ParamsHelpers.getParam(req.query, 'keyword', '');
  if(keyword !== ' ') objWhere.keyword = keyword; else   objWhere.keyword = '';
  if(categorySlug === 'all') {
    title = 'News Category';
    taskCategory = 'all-items';
  } else if( categorySlug === 'trending') {
    title = 'Trends';
    taskCategory = 'items-trending';
  } else {
    let idCategory = '';
    taskCategory = 'items-in-category';
    await CategoryModel.getItems({slug: categorySlug}, {task: 'get-items-by-slug'}).then( (items) => {idCategory = items[0].id; title = items[0].name});
    objWhere.id = idCategory;
  }
  await ArticleModel.listItemsFrontend(objWhere, {task: taskCategory}).then( (item) => {itemsInCategory = item;});

  res.render(`${folderView}index`, { 
    pageTitle   : title,
    top_post: false,
    contact_layout: false,
    layout: layoutShop,
    itemsInCategory,
    categorySlug,
    keyword,
  });

});

module.exports = router;
