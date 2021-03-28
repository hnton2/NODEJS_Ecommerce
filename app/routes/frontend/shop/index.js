var express = require('express');
var router = express.Router();

const middlewareGetBrand   = require(__path_middleware + 'shop/get-brand-in-menu');
const middlewareGetProductCategory	    = require(__path_middleware + 'shop/get-category-in-menu');
const middlewareGetArticleCategory 	= require(__path_middleware + 'blog/get-category-for-menu');
const middlewareGetLastedNews	= require(__path_middleware + 'blog/get-lasted-news');


router.use('/', middlewareGetBrand, middlewareGetProductCategory, middlewareGetArticleCategory, middlewareGetLastedNews, require('./home'));
router.use('/category', require('./category'));
router.use('/shoes', require('./shoes'));
router.use('/contact', require('./contact'));
router.use('/about', require('./about'));
router.use('/news', require('./article'));
router.use('/news-category', require('./news-category'));
router.use('/news-rss', require('./news-rss'));

module.exports = router;
