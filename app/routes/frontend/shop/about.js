var express = require('express');
var router = express.Router();

const UserModel = require(__path_models + 'users');

const folderView	 = __path_views_shop + 'pages/about/';
const layoutShop    = __path_views_shop + 'frontend';
/* GET home page. */
router.get('/',  async (req, res, next) => {
  let users = [];
  await UserModel.listItemsFrontend().then( (items) => {users = items;});
  res.render(`${folderView}index`, { 
    pageTitle : 'About us',
    top_post: false,
    contact_layout: false,
    sidebar_rss: false,
    layout: layoutShop,
    users,
  });

});

module.exports = router;
