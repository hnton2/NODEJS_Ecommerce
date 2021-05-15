var express = require('express');
var router = express.Router();

const authentication  	= require(__path_middleware + 'auth');

router.use('/', require('./home'));
router.use('/dashboard', require('./dashboard'));
router.use('/items', require('./items'));
router.use('/contact', require('./contact'));
router.use('/groups', require('./groups'));
router.use('/users', require('./users'));
router.use('/category', require('./category'));
router.use('/articles', require('./articles'));
router.use('/rss', require('./rss'));
router.use('/product-category', require('./product-category'));
router.use('/brand', require('./brand'));
router.use('/shoes', require('./shoes'));
router.use('/slider', require('./slider'));
router.use('/banner', require('./banner'));
router.use('/subscribe', require('./subscribe'));
router.use('/orders', require('./orders'));
router.use('/promo', require('./promo'));
router.use('/shipping', require('./shipping'));
router.use('/config', require('./config'));
router.use('/clothing-category', require('./clothing-category'));
router.use('/clothing', require('./clothing'));
router.use('/accessory-category', require('./accessory-category'));
router.use('/accessory', require('./accessory'));

module.exports = router;
