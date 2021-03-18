var express = require('express');
var router = express.Router();

const ParamsHelpers 	= require(__path_helpers + 'params');

const ArticleModel = require(__path_models + 'articles');

const folderView	 = __path_views_blog + 'pages/search/';
const layoutBlog    = __path_views_blog + 'frontend';

/* GET home page. */
router.get('/', async (req, res, next) => {
  let keyword = ParamsHelpers.getParam(req.query, 'keyword', '');
  let items = [];
  console.log(keyword);
  await ArticleModel.listItemsFrontend({keyword: keyword}, {task: 'items-search'}).then( (data) => {items = data});
  res.render(`${folderView}index`, { 
    pageTitle   : 'Tìm kiếm',
    top_post: false,
    trending_post: false,
    layout_rss: false,
    layout_contact: false,
    layout_article: false,
    layout: layoutBlog,
    items,
  });

});

module.exports = router;
