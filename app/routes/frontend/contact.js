var express = require('express');
var router = express.Router();

const folderView	 = __path_views_blog + 'pages/contact/';
const layoutBlog    = __path_views_blog + 'frontend';

/* GET home page. */
router.get('/',   async (req, res, next) => {
  res.render(`${folderView}index`, { 
    pageTitle   : 'publishPage ',
    top_post: false,
    layout: layoutBlog,
  });

});

module.exports = router;
