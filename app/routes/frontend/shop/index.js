var express = require('express');
var router = express.Router();

const middlewareGetBrand            = require(__path_middleware + 'shop/get-brand-in-menu');
const middlewareGetProductCategory	= require(__path_middleware + 'shop/get-category-in-menu');
const middlewareGetClothingCategory	= require(__path_middleware + 'shop/get-clothing-category-in-menu');
const middlewareGetAccessoryCategory	= require(__path_middleware + 'shop/get-accessory-category-in-menu');
const middlewareGetArticleCategory 	= require(__path_middleware + 'blog/get-category-for-menu');
const middlewareGetLastedNews	    = require(__path_middleware + 'blog/get-lasted-news');
const middlewareWebConfig	        = require(__path_middleware + 'shop/web-config');

router.use('/auth', require('./auth'));
router.use('/',middlewareWebConfig, middlewareGetBrand, middlewareGetProductCategory, middlewareGetArticleCategory, middlewareGetLastedNews, middlewareGetClothingCategory, middlewareGetAccessoryCategory, require('./home'));
router.use('/category', require('./category'));
router.use('/shoes', require('./shoes'));
router.use('/contact', require('./contact'));
router.use('/about', require('./about'));
router.use('/news', require('./article'));
router.use('/c-news', require('./news-category'));
router.use('/news-rss', require('./news-rss'));
router.use('/cart', require('./cart'));
router.use('/checkout', require('./checkout'));
router.use('/orders-tracking', require('./orders-tracking'));

module.exports = router;
