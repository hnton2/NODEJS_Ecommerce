var express = require('express');
var router = express.Router();

const ArticleModel = require(__path_models + 'articles');
const folderView	 = __path_views_blog + 'pages/home/';
const layoutBlog    = __path_views_blog + 'frontend';

/* GET home page. */
router.get('/', async (req, res, next) => {
  let itemsSpecial = [];
  let itemsNews = [];
  // Special
  await ArticleModel.listItemsFrontend(null, {task: 'items-special'}).then( (items) => {itemsSpecial = items;});
  // Latest New
  await ArticleModel.listItemsFrontend(null, {task: 'items-news'}).then( (items) => {itemsNews = items;});
  
  res.render(`${folderView}index`, {
    pageTitle   : 'Home ',
    top_post: true,
    layout_rss: false,
    layout: layoutBlog,
    itemsSpecial,
    itemsNews,
  });
});

module.exports = router;
