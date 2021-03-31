var express = require('express');
var router = express.Router();
const ArticleModel = require(__path_models + 'articles');
const CategoryModel = require(__path_models + 'category');

const ParamsHelpers 	= require(__path_helpers + 'params');
const folderView	 = __path_views_shop + 'pages/news/';
const layoutShop    = __path_views_shop + 'frontend';

/* GET home page. */
router.get('/:slug', async (req, res, next) => {
  let slugArticle = ParamsHelpers.getParam(req.params, 'slug', '');
  let itemArticle = [];
  let itemMainCategory = [];
  let itemsRelated = [];

  // Main article
  await ArticleModel.getMainArticle(slugArticle, null).then( (items) => {itemArticle = items;});
  // Main Category
  await CategoryModel.getItems({id: itemArticle[0].category.id}, {task: 'get-items-by-id'}).then( (items) => {itemMainCategory = items;});
  // Related  article
  await ArticleModel.listItemsFrontend(itemArticle[0], {task: 'items-related'}).then( (items) => {itemsRelated = items;});
  res.render(`${folderView}index`, {
    pageTitle   : itemArticle[0].name,
    top_post: false,
    contact_layout: false,
    sidebar_rss: false,
    layout: layoutShop,
    itemArticle,
    itemMainCategory,
    itemsRelated
  });

});

module.exports = router;
