var express = require('express');
var router 	= express.Router();

var passport = require('passport');

const systemConfig  	= require(__path_configs + 'system');
const MainValidate		= require(__path_validates + 'login');
const StringHelpers  	= require(__path_helpers + 'string');

const middlewareGetUserInfo  	        = require(__path_middleware + 'get-user-info');
const middlewareGetCategoryForMenu  	= require(__path_middleware + 'get-category-for-menu');
const middlewareGetRandomArticles	    = require(__path_middleware + 'get-random-articles');

const folderView 		= __path_views_blog + 'pages/auth/';
const layoutLogin   	= __path_views_blog + 'login';
const layoutBlog    = __path_views_blog + 'frontend';

const linkIndex		 	= StringHelpers.formatLink('/' + systemConfig.prefixBlog + '/');
const linkLogin		 	= StringHelpers.formatLink('/' + systemConfig.prefixBlog + '/auth/login/');

/* GET logout page. */
router.get('/logout', function(req, res, next) {
	req.logout();
	res.redirect(linkLogin);
});

/* GET login page. */
router.get('/login', (req, res, next) => {
	if(req.isAuthenticated())	res.redirect(linkIndex);

	let item	= {username: '', password: ''};
	let errors   = null;
	res.render(`${folderView}login`, { layout: layoutLogin, errors, item });
});

/* GET no-permission page. */
router.get('/no-permission', middlewareGetUserInfo, middlewareGetCategoryForMenu, middlewareGetRandomArticles, function(req, res, next) {
	res.render(`${folderView}no-permission`, { layout: layoutBlog, top_post: false });
});

/* POST login page. */
router.post('/login', function(req, res, next) {
	if(req.isAuthenticated())	res.redirect(linkIndex);
	
	req.body = JSON.parse(JSON.stringify(req.body));
	MainValidate.validator(req);

	let item 	= Object.assign(req.body);
	let errors 	= req.validationErrors();

	if(errors) { 
		res.render(`${folderView}login`, {  layout: layoutLogin, item, errors });
	}else {
		passport.authenticate('local', { 
			successRedirect: linkIndex,
            failureRedirect: linkLogin,
			failureFlash: true
		})(req, res, next);
	}
});



module.exports = router;
