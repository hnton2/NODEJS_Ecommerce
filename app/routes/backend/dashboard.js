var express = require('express');
var router = express.Router();

const ItemsModel 	= require(__path_schemas + 'items');
const GroupsModel 	= require(__path_schemas + 'groups');
const UsersModel 	= require(__path_schemas + 'users');
const CategoryModel 	= require(__path_schemas + 'category');
const ArticlesModel 	= require(__path_schemas + 'articles');
const RSSModel 	= require(__path_schemas + 'rss');
const ProductCategoryModel 	= require(__path_schemas + 'product-category');
const ProductModel 	= require(__path_schemas + 'products');
const ContactModel 	= require(__path_schemas + 'contact');

const folderView	 = __path_views_admin + 'pages/dashboard/';
const UtilsHelpers 	= require(__path_helpers + 'utils');

/* GET dashboard page. */
router.get('/', async function(req, res, next) {
  let totalGroups = await UtilsHelpers.countCollections(GroupsModel);
  let totalUsers = await UtilsHelpers.countCollections(UsersModel);
  let totalCategory = await UtilsHelpers.countCollections(CategoryModel);
  let totalArticles = await UtilsHelpers.countCollections(ArticlesModel);
  let totalItems = await UtilsHelpers.countCollections(ItemsModel);
  let totalRss = await UtilsHelpers.countCollections(RSSModel);
  let totalProductCategory = await UtilsHelpers.countCollections(ProductCategoryModel);
  let totalProduct = await UtilsHelpers.countCollections(ProductModel);
  let totalContact = await UtilsHelpers.countCollections(ContactModel);

  res.render(`${folderView}index`, { 
    pageTitle: 'Dashboard Page',
    'courseName': '<p>NodeJS</p>',
    totalItems,
    totalGroups,
    totalUsers,
    totalCategory,
    totalArticles,
    totalRss,
    totalProductCategory,
    totalProduct,
    totalContact,
  });
});

module.exports = router;
