var express = require('express');
var router = express.Router();

const ArticleModel = require(__path_models + 'articles');
const CategoryModel = require(__path_models + 'category');
const folderView	 = __path_views_blog + 'pages/home/';
const layoutBlog    = __path_views_blog + 'frontend';

/* GET home page. */
router.get('/', async (req, res, next) => {
  let itemsSpecial = [];
  let itemsNews = [];
  let allItems = [];

  // Special
  await ArticleModel.listItemsFrontend(null, {task: 'items-special'}).then( (items) => {itemsSpecial = items;});
  // All Items
  await ArticleModel.listItemsFrontend(null, {task: 'all-items'}).then( (items) => {allItems = items;});
  // Latest New
  await ArticleModel.listItemsFrontend(null, {task: 'items-news'}).then( (items) => {itemsNews = items;});

  
  res.render(`${folderView}index`, {
    pageTitle   : 'Trang chủ',
    top_post: true,
    trending_post: true,
    layout_rss: false,
    layout_contact: false,
    layout_article: false,
    layout: layoutBlog,
    itemsSpecial,
    itemsNews,
    allItems,
  });
});
module.exports = router;
