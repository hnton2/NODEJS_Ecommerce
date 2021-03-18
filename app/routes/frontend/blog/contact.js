var express = require('express');
var router = express.Router();

const folderView	 = __path_views_blog + 'pages/contact/';
const layoutBlog    = __path_views_blog + 'frontend';

/* GET home page. */
router.get('/',   async (req, res, next) => {
  res.render(`${folderView}index`, { 
    pageTitle   : 'Liên hệ',
    top_post: false,
    trending_post: false,
    layout_rss: false,
    layout_contact: true,
    layout_article: false,
    layout: layoutBlog,
  });

});

module.exports = router;
