var express = require('express');
var router = express.Router();

const ShoesModel = require(__path_models + 'shoes');
const CategoryModel = require(__path_models + 'product-category');
const ParamsHelpers 	= require(__path_helpers + 'params');
const NotifyHelpers		= require(__path_helpers + 'notify');
const StringHelpers		= require(__path_helpers + 'string');
const systemConfig  	= require(__path_configs + 'system');

const notify  		= require(__path_configs + 'notify');
const folderView	 = __path_views_shop + 'pages/shoes/';
const layoutShop    = __path_views_shop + 'frontend';
/* GET home page. */
router.get('/:slug', async (req, res, next) => {
  let slugShoes = ParamsHelpers.getParam(req.params, 'slug', ''); 
  let item= [];
  let itemMainCategory = [];
  let itemsRelated = [];
  // Main
  await ShoesModel.getMainItems(slugShoes, null).then( (items) => {item = items[0];});
  // Main Category
  await CategoryModel.getItems({id: item.category.id}, {task: 'get-items-by-id'}).then( (items) => {itemMainCategory = items;});
  // Related
  await ShoesModel.listItemsFrontend(item, {task: 'items-related'}).then( (items) => {itemsRelated = items;});

  res.render(`${folderView}index`, {
    pageTitle: item.name,
    top_post: false,
    contact_layout: false,
    sidebar_rss: false,
    layout: layoutShop,
    item,
    itemMainCategory,
    itemsRelated
  });

});

router.post('/review/:slug', async (req, res, next) => {
  let slug = ParamsHelpers.getParam(req.params, 'slug', '');
  let id = '';

  const linkIndex		 	= StringHelpers.formatLink('/' + systemConfig.prefixShop + `/shoes/${slug}`);
  await ShoesModel.getMainItems(slug, null).then( (items) => {id = items[0].id;});
  req.body = JSON.parse(JSON.stringify(req.body));
	let item = Object.assign(req.body);
  item.time = Date.now();
	ShoesModel.saveReview(id, item).then( (result) => {
		NotifyHelpers.showNotify(req, res, linkIndex, {tasks: 'add-review-success'});
	});
});


router.post('/favorite/:id', async (req, res, next) => {
  let id = ParamsHelpers.getParam(req.params, 'id', '');
  ShoesModel.favoriteItem(id).then( (result) => {
    res.json({message: notify.FAVORITE_SUCCESS});
  })

});

module.exports = router;
