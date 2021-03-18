var express = require('express');
var router = express.Router();
const ArticleModel = require(__path_models + 'articles');

const ParamsHelpers 	= require(__path_helpers + 'params');
const folderView	 = __path_views_blog + 'pages/article/';
const layoutBlog    = __path_views_blog + 'frontend';

/* GET home page. */
router.get('/:id', async (req, res, next) => {
  let idArticle = ParamsHelpers.getParam(req.params, 'id', '');
  let itemArticle = [];
  let itemsRelated = [];

  // Main article
  await ArticleModel.getMainArticle(idArticle, null).then( (items) => {itemArticle = items;});
  // Related  article
  await ArticleModel.listItemsFrontend(itemArticle, {task: 'items-related'}).then( (items) => {itemsRelated = items;});
  res.render(`${folderView}index`, {
    pageTitle   : itemArticle.name,
    top_post: false,
    trending_post: false,
    layout_rss: false,
    layout_contact: false,
    layout_article: true,
    layout: layoutBlog,
    itemArticle,
    itemsRelated
  });

});

module.exports = router;
