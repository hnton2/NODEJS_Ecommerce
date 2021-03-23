var express = require('express');
var router = express.Router();

const folderView	 = __path_views_shop + 'pages/about/';
const layoutShop    = __path_views_shop + 'frontend';
/* GET home page. */
router.get('/',  async (req, res, next) => {
  res.render(`${folderView}index`, { 
    pageTitle : 'Home',
    top_post: false,
    contact_layout: false,
    layout: layoutShop,
  });

});

module.exports = router;
