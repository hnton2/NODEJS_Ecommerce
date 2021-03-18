var express = require('express');
var router = express.Router();

router.use('/', require('./home'));
router.use('/category', require('./category'));
router.use('/article', require('./article'));
router.use('/contact', require('./contact'));
router.use('/about', require('./about'));

module.exports = router;
