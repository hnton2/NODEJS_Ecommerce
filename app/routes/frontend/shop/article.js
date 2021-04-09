var express = require('express');
var router = express.Router();
const ArticleModel = require(__path_models + 'articles');
const CategoryModel = require(__path_models + 'category');
const NotifyHelpers		= require(__path_helpers + 'notify');
const StringHelpers		= require(__path_helpers + 'string');
const systemConfig  	= require(__path_configs + 'system');

const ParamsHelpers 	= require(__path_helpers + 'params');
const folderView	 = __path_views_shop + 'pages/news/';
const layoutShop    = __path_views_shop + 'frontend';

/* GET home page. */
router.get('/:slug', async (req, res, next) => {
  let slug = ParamsHelpers.getParam(req.params, 'slug', '');
  let itemMain = [];
  let itemMainCategory = [];
  let itemsRelated = [];

  // Main article
  await ArticleModel.getMainItems(slug, null).then( (items) => {itemMain = items;});
  // Main Category
  await CategoryModel.getItems({id: itemMain[0].category.id}, {task: 'get-items-by-id'}).then( (items) => {itemMainCategory = items;});
  // Related  article
  await ArticleModel.listItemsFrontend(itemMain[0], {task: 'items-related'}).then( (items) => {itemsRelated = items;});
  res.render(`${folderView}index`, {
    pageTitle   : itemMain[0].name,
    top_post: false,
    contact_layout: false,
    sidebar_rss: false,
    layout: layoutShop,
    itemMain,
    itemMainCategory,
    itemsRelated
  });

});

router.post('/comments/:slug', async (req, res, next) => {
  let slug = ParamsHelpers.getParam(req.params, 'slug', '');
  let id = '';

  const linkIndex		 	= StringHelpers.formatLink('/' + systemConfig.prefixShop + `/news/${slug}`);
  await ArticleModel.getMainItems(slug, null).then( (items) => {id = items[0].id;});
  req.body = JSON.parse(JSON.stringify(req.body));
	let item = Object.assign(req.body);
  item.time = Date.now();
	ArticleModel.saveReview(id, item).then( (result) => {
		NotifyHelpers.showNotify(req, res, linkIndex, {tasks: 'add-review-success'});
	});
});

module.exports = router;
