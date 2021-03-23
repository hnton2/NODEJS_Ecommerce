var express = require('express');
var router = express.Router();

const middlewareGetBrand   = require(__path_middleware + 'shop/get-brand-in-menu');
const middlewareGetProductCategory	    = require(__path_middleware + 'shop/get-category-in-menu');


router.use('/', middlewareGetBrand, middlewareGetProductCategory, require('./home'));
router.use('/category', require('./category'));
router.use('/shoes', require('./shoes'));
router.use('/contact', require('./contact'));
router.use('/about', require('./about'));

module.exports = router;
