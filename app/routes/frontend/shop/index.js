var express = require('express');
var router = express.Router();

const middlewareGetBrand                = require(__path_middleware + 'shop/get-brand-in-menu');
const middlewareGetProductCategory	    = require(__path_middleware + 'shop/get-category-in-menu');
const middlewareGetClothingCategory	    = require(__path_middleware + 'shop/get-clothing-category-in-menu');
const middlewareGetAccessoryCategory	= require(__path_middleware + 'shop/get-accessory-category-in-menu');
const middlewareGetBanner	            = require(__path_middleware + 'shop/get-banner');
const middlewareGetArticleCategory 	    = require(__path_middleware + 'blog/get-category-for-menu');
const middlewareWebConfig	            = require(__path_middleware + 'web-config');

router.use('/auth', require('./auth'));
router.use('/',
            middlewareWebConfig, middlewareGetBrand, middlewareGetProductCategory,
            middlewareGetArticleCategory, middlewareGetClothingCategory, 
            middlewareGetAccessoryCategory, middlewareGetBanner,
            require('./home'));
router.use('/category', require('./category'));
router.use('/shoes', require('./shoes'));
router.use('/clothing', require('./clothing'));
router.use('/accessory', require('./accessory'));
router.use('/contact', require('./contact'));
router.use('/about', require('./about'));
router.use('/news', require('./news'));
router.use('/blog', require('./news-category'));
router.use('/news-rss', require('./news-rss'));
router.use('/cart', require('./cart'));
router.use('/checkout', require('./checkout'));
router.use('/orders-tracking', require('./orders-tracking'));
router.use('/event', require('./event'));
router.use('/promotion', require('./promotion'));

module.exports = router;
