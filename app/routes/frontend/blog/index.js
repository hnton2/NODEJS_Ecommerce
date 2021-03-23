var express = require('express');
var router = express.Router();

const middlewareGetUserInfo  	        = require(__path_middleware + 'get-user-info');
const middlewareGetCategoryForMenu  	= require(__path_middleware + 'blog/get-category-for-menu');
const middlewareGetRandomArticles	    = require(__path_middleware + 'blog/get-random-articles');
const middlewareGetTrendingArticles	    = require(__path_middleware + 'blog/get-trending-articles');

router.use('/auth', require('./auth'));
router.use('/', middlewareGetUserInfo, middlewareGetCategoryForMenu, 
            middlewareGetRandomArticles, middlewareGetTrendingArticles, require('./home'));
router.use('/category', require('./category'));
router.use('/search', require('./search'));
router.use('/article', require('./article'));
router.use('/contact', require('./contact'));
router.use('/about', require('./about'));
router.use('/rss', require('./rss'));
router.use('/search', require('./search'));

module.exports = router;
