var express = require('express');
var router = express.Router();

const ParamsHelpers 	= require(__path_helpers + 'params');

const ArticleModel = require(__path_models + 'articles');
const CategoryModel = require(__path_models + 'article-category');

const folderView	 = __path_views_blog + 'pages/article-category/';
const layoutBlog    = __path_views_blog + 'frontend';

/* GET home page. */
router.get('/:slug', async (req, res, next) => {
  let slugCategory = ParamsHelpers.getParam(req.params, 'slug', '');
  let idCategory = '';
  let itemsInCategory = [];

  // Article in Category
  await CategoryModel.getItems({slug: slugCategory}, {task: 'get-items-by-slug'}).then( (items) => {idCategory = items[0].id;});
  // Article in Category
  await ArticleModel.listItemsFrontend({id: idCategory}, {task: 'items-in-category'}).then( (items) => {itemsInCategory = items;});
  res.render(`${folderView}index`, { 
    pageTitle   : itemsInCategory[0].category.name,
    top_post: false,
    trending_post: false,
    layout_rss: false,
    layout_contact: false,
    layout_article: false,
    layout: layoutBlog,
    itemsInCategory,
  });

});

module.exports = router;
