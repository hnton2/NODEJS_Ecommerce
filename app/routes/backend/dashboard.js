var express = require('express');
var router = express.Router();

const ItemsModel 	= require(__path_schemas + 'items');
const GroupsModel 	= require(__path_schemas + 'groups');
const UsersModel 	= require(__path_schemas + 'users');
const CategoryModel 	= require(__path_schemas + 'category');
const ArticlesModel 	= require(__path_schemas + 'articles');
const RSSModel 	= require(__path_schemas + 'rss');
const ProductCategoryModel 	= require(__path_schemas + 'product-category');
const ShoesModel 	= require(__path_schemas + 'shoes');
const BrandModel 	= require(__path_schemas + 'brand');
const ContactModel 	= require(__path_schemas + 'contact');
const ClothingModel 	= require(__path_schemas + 'clothing');
const SliderModel 	= require(__path_schemas + 'slider');

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
  let totalShoes = await UtilsHelpers.countCollections(ShoesModel);
  let totalContact = await UtilsHelpers.countCollections(ContactModel);
  let totalBrand = await UtilsHelpers.countCollections(BrandModel);
  let totalClothing = await UtilsHelpers.countCollections(ClothingModel);
  let totalSlider = await UtilsHelpers.countCollections(SliderModel);


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
    totalShoes,
    totalContact,
    totalBrand,
    totalClothing,
    totalSlider
  });
});

module.exports = router;
