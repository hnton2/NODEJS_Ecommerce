var express = require('express');
var router = express.Router();

const PromoModel = require(__path_models + 'promo');

const folderView	 = __path_views_shop + 'pages/promo/';
const layoutShop    = __path_views_shop + 'frontend';
/* GET home page. */
router.get('/',  async (req, res, next) => {
  let items = [];
  await PromoModel.listItemsFrontend(null, {task: 'items-in-menu'}).then( (data) => {items = data;});
  res.render(`${folderView}index`, { 
    pageTitle : 'Promotion',
    top_post: false,
    contact_layout: false,
    layout: layoutShop,
    items,
  });
});

module.exports = router;
