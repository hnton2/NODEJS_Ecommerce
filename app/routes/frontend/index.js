var express = require('express');
var router = express.Router();

const middlewareGetUserInfo  	        = require(__path_middleware + 'get-user-info');
const middlewareGetCategoryForMenu  	= require(__path_middleware + 'get-category-for-menu');
const middlewareGetRandomArticles	    = require(__path_middleware + 'get-random-articles');

router.use('/auth', require('./auth'));
router.use('/', middlewareGetUserInfo, middlewareGetCategoryForMenu, middlewareGetRandomArticles, require('./home'));
router.use('/category', require('./category'));
router.use('/article', require('./article'));
router.use('/contact', require('./contact'));
router.use('/about', require('./about'));
router.use('/rss', require('./rss-sport'));
router.use('/gold-price', require('./rss-gold-price'));
router.use('/coin-price', require('./rss-coin-price'));

module.exports = router;
