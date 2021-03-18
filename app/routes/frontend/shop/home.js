var express = require('express');
var router = express.Router();

const folderView	 = __path_views_shop + 'pages/home/';
const layoutShop    = __path_views_shop + 'frontend';

/* GET home page. */
router.get('/', async (req, res, next) => {
  res.render(`${folderView}index`, {
    pageTitle   : 'Trang chủ',
    top_post: true,
    layout: layoutShop,
  });
});

module.exports = router;
