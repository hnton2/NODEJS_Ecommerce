var express = require('express');
var router = express.Router();

const ParamsHelpers 	= require(__path_helpers + 'params');

const ArticleModel = require(__path_models + 'news');
const CategoryModel = require(__path_models + 'news-category');

const folderView	 = __path_views_shop + 'pages/news-category/';
const layoutShop    = __path_views_shop + 'frontend';

router.get('/:category/', async (req, res, next) => {
  let title = '';
  let taskCategory = '';
  let params = {};
  let itemsInCategory = [];
  let categorySlug = ParamsHelpers.getParam(req.params, 'category', '');
  let keyword		 = ParamsHelpers.getParam(req.query, 'keyword', '');
  if(keyword !== ' ') params.keyword = keyword; else   params.keyword = '';
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
    params.id = idCategory;
  }
  await ArticleModel.listItemsFrontend(params, {task: taskCategory}).then( (item) => {itemsInCategory = item;});
  let pagination 	 = {
		totalItems		 : 1,
		totalItemsPerPage: 10,
		currentPage		 : parseInt(ParamsHelpers.getParam(req.query, 'page', 1)),
		pageRanges		 : 3,
    totalItems: itemsInCategory.length
	};
  itemsInCategory = itemsInCategory.slice((pagination.currentPage - 1) * pagination.totalItemsPerPage, pagination.currentPage * pagination.totalItemsPerPage);

  res.render(`${folderView}index`, { 
    pageTitle   : title,
    top_post: false,
    contact_layout: false,
    layout: layoutShop,
    itemsInCategory,
    categorySlug,
    keyword,
    pagination,
    params,
  });

});

module.exports = router;
