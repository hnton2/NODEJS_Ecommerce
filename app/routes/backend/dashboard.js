var express = require('express');
var router = express.Router();

const ItemsModel 	= require(__path_schemas + 'items');
const GroupsModel 	= require(__path_schemas + 'groups');
const UsersModel 	= require(__path_schemas + 'users');
const CategoryModel 	= require(__path_schemas + 'news-category');
const ArticlesModel 	= require(__path_schemas + 'news');
const RSSModel 	= require(__path_schemas + 'rss');
const ProductCategoryModel 	= require(__path_schemas + 'shoes-category');
const ShoesModel 	= require(__path_schemas + 'shoes');
const BrandModel 	= require(__path_schemas + 'brand');
const ContactModel 	= require(__path_schemas + 'contact');
const SliderModel 	= require(__path_schemas + 'slider');
const BannerModel 	= require(__path_schemas + 'banner');
const SubscribeModel 	= require(__path_schemas + 'subscribe');
const OrdersModel 	= require(__path_schemas + 'orders');
const PromoModel 	= require(__path_schemas + 'promo');
const ClothingCategoryModel 	= require(__path_schemas + 'clothing-category');
const ClothingModel 	= require(__path_schemas + 'clothing');
const AccessoryCategoryModel 	= require(__path_schemas + 'accessory-category');
const AccessoryModel 	= require(__path_schemas + 'accessory');
const EventsModel 	= require(__path_schemas + 'events');

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
  let totalSlider = await UtilsHelpers.countCollections(SliderModel);
  let totalBanner = await UtilsHelpers.countCollections(BannerModel);
  let totalSubscribe = await UtilsHelpers.countCollections(SubscribeModel);
  let totalOrders = await UtilsHelpers.countCollections(OrdersModel);
  let totalPromo = await UtilsHelpers.countCollections(PromoModel);
  let totalClothingCategory = await UtilsHelpers.countCollections(ClothingCategoryModel);
  let totalClothing = await UtilsHelpers.countCollections(ClothingModel);
  let totalAccessoryCategory = await UtilsHelpers.countCollections(AccessoryCategoryModel);
  let totalAccessory = await UtilsHelpers.countCollections(AccessoryModel);
  let totalEvents = await UtilsHelpers.countCollections(EventsModel);
  
  res.render(`${folderView}index`, { 
    pageTitle: 'Dashboard',
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
    totalSlider,
    totalBanner,
    totalSubscribe,
    totalOrders,
    totalPromo,
    totalClothingCategory,
    totalClothing,
    totalAccessoryCategory,
    totalAccessory,
    totalEvents,
  });
});

module.exports = router;
