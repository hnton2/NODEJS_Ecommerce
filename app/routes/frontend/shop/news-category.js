var express = require('express');
var router = express.Router();

const ParamsHelpers 	= require(__path_helpers + 'params');

const ArticleModel = require(__path_models + 'articles');
const CategoryModel = require(__path_models + 'category');

const folderView	 = __path_views_shop + 'pages/news-category/';
const layoutShop    = __path_views_shop + 'frontend';


router.get('/:category/', async (req, res, next) => {
  let title = '';
  let taskCategory = '';
  let objWhere = {};
  let itemsInCategory = [];
  let category = ParamsHelpers.getParam(req.params, 'category', '');
  let query = ParamsHelpers.getParam(req.query, 'keyword', '');
  if(query !== '') objWhere.name = new RegExp(query, 'i');
  if(category === 'all') {
    title = 'News Category';
    taskCategory = 'all-items';
  } else if( category === 'trending') {
    title = 'Trends';
    taskCategory = 'items-trending';
  } else {
    let idCategory = '';
    taskCategory = 'items-in-category';
    await CategoryModel.getItems({slug: category}, {task: 'get-items-by-slug'}).then( (items) => {idCategory = items[0].id; title = items[0].name});
    objWhere.id = idCategory;
  }
  await ArticleModel.listItemsFrontend(objWhere, {task: taskCategory}).then( (item) => {itemsInCategory = item;});
  if(query !== '') title = 'Search results for the word "' + query + '"';

  res.render(`${folderView}index`, { 
    pageTitle   : title,
    top_post: false,
    contact_layout: false,
    sidebar_rss: false,
    layout: layoutShop,
    itemsInCategory,
    query
  });

});

module.exports = router;
