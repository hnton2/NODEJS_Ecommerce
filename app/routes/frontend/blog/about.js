var express = require('express');
var router = express.Router();

const folderView	 = __path_views_blog + 'pages/about/';
const layoutBlog    = __path_views_blog + 'frontend';

/* GET home page. */
router.get('/',  async (req, res, next) => {
  res.render(`${folderView}index`, { 
    pageTitle   : 'About',
    top_post: false,
    trending_post: false,
    layout_rss: false,
    layout_contact: false,
    layout_article: false,
    layout: layoutBlog,
  });

});

module.exports = router;
