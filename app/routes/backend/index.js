var express = require('express');
var router = express.Router();

const authentication  	= require(__path_middleware + 'auth');
const userInfo  	= require(__path_middleware + 'get-user-info');

router.use('/', authentication, userInfo, require('./home'));
router.use('/dashboard', require('./dashboard'));
router.use('/items', require('./items'));
router.use('/groups', require('./groups'));
router.use('/users', require('./users'));
router.use('/category', require('./category'));
router.use('/articles', require('./articles'));
router.use('/rss', require('./rss'));

module.exports = router;
