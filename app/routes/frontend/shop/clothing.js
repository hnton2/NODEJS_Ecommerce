var express = require('express');
var router = express.Router();

const ClothingModel = require(__path_models + 'clothing');
const CategoryModel = require(__path_models + 'clothing-category');
const ParamsHelpers 	= require(__path_helpers + 'params');
const NotifyHelpers		= require(__path_helpers + 'notify');
const StringHelpers		= require(__path_helpers + 'string');
const systemConfig  	= require(__path_configs + 'system');

const notify  		= require(__path_configs + 'notify');
const folderView	 = __path_views_shop + 'pages/clothing/';
const layoutShop    = __path_views_shop + 'frontend';
/* GET home page. */
router.get('/:slug', async (req, res, next) => {
  let slug = ParamsHelpers.getParam(req.params, 'slug', ''); 
  let item= [];
  let mainCategory = [];
  let itemsRelated = [];
  // Main
  await ClothingModel.getMainItems(slug, null).then( (items) => {item = items[0];});
  // Main Category
  await CategoryModel.getItems({id: item.category.id}, {task: 'get-items-by-id'}).then( (items) => {mainCategory = items;});
  // Related
  await ClothingModel.listItemsFrontend(item, {task: 'items-related'}).then( (items) => {itemsRelated = items;});

  res.render(`${folderView}index`, {
    pageTitle: item.name,
    top_post: false,
    contact_layout: false,
    layout: layoutShop,
    item,
    mainCategory,
    itemsRelated
  });

});

router.post('/review/:slug', async (req, res, next) => {
  let slug = ParamsHelpers.getParam(req.params, 'slug', '');
  let id = '';

  const linkIndex		 	= StringHelpers.formatLink('/' + systemConfig.prefixShop + `/clothing/${slug}`);
  await ClothingModel.getMainItems(slug, null).then( (items) => {id = items[0].id;});
  req.body = JSON.parse(JSON.stringify(req.body));
	let item = Object.assign(req.body);
  item.time = Date.now();
	ClothingModel.saveReview(id, item).then( (result) => {
		NotifyHelpers.showNotify(req, res, linkIndex, {tasks: 'add-review-success'});
	});
});


router.post('/favorite/:id', async (req, res, next) => {
  let id = ParamsHelpers.getParam(req.params, 'id', '');
  ClothingModel.favoriteItem(id).then( (result) => {
    res.json({message: notify.FAVORITE_SUCCESS});
  })

});

module.exports = router;
