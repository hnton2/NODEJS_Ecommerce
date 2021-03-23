var express = require('express');
var router = express.Router();

const ShoesModel = require(__path_models + 'shoes');
const ParamsHelpers 	= require(__path_helpers + 'params');

const folderView	 = __path_views_shop + 'pages/shoes/';
const layoutShop    = __path_views_shop + 'frontend';
/* GET home page. */
router.get('/:id', async (req, res, next) => {
  let idMain = ParamsHelpers.getParam(req.params, 'id', '');
  let itemMain= [];
  let itemsRelated = [];
  // Main
  await ShoesModel.getMainArticle(idMain).then( (items) => {itemMain = items;});
  // Related
  await ShoesModel.listItemsFrontend(itemMain, {task: 'items-related'}).then( (items) => {itemsRelated = items;});

  res.render(`${folderView}index`, {
    pageTitle   : itemMain.name,
    top_post: false,
    contact_layout: false,
    layout: layoutShop,
    itemMain,
    itemsRelated
  });

});

module.exports = router;
