var express = require('express');
var router = express.Router();

const OrdersModel = require(__path_models + 'orders');
const ShippingModel = require(__path_models + 'shipping');
const PromoModel = require(__path_models + 'promo');
const ConfigModel = require(__path_models + 'config');
const StringHelpers   = require(__path_helpers + 'string');
const EmailHelpers		= require(__path_helpers + 'email');
const UtilsHelpers 		= require(__path_helpers + 'utils');

const folderView	 = __path_views_shop + 'pages/checkout/';
const layoutShop    = __path_views_shop + 'frontend';
const linkIndex     = '/orders-tracking/confirm';

router.get('/', async (req, res, next) => {
  let items = [];
  let sale_off = 0;
  if(req.cookies.cart !== undefined) {
    items = req.cookies.cart;
  }
  if(req.cookies.sale_off !== undefined) {
    sale_off = req.cookies.sale_off.discount;
  }
  res.render(`${folderView}index`, {
    pageTitle : 'Checkout',
    top_post: false,
    contact_layout: false,
    layout: layoutShop,
    items,
    sale_off,
  });
});

router.get('/get-shipping-fee',   async (req, res, next) => {
  ShippingModel.getItems(null, {task: 'all-item'}).then( (item) => { res.json(item); });
});

router.post('/save', async (req, res, next) => {
  let product = [];
  let sale_off = {};

  if(req.cookies.cart !== undefined) product = JSON.parse(JSON.stringify(req.cookies.cart));
  if(req.cookies.sale_off !== undefined) sale_off = JSON.parse(JSON.stringify(req.cookies.sale_off)); 
  let invoiceCode = StringHelpers.generateCode(10);
  let user = JSON.parse(JSON.stringify(req.body));

  let emailConfig = [];
  await ConfigModel.getEmail().then( (items) => { emailConfig = items[0]});
  UtilsHelpers.countingSoldProduct(product[0].id, product[0].product_type);
  await PromoModel.increasingUsedTimes(sale_off.code).then( (result) => { });
  
  await OrdersModel.saveItems(invoiceCode, product, user, sale_off).then( (result) => {
    EmailHelpers.sendEmail(emailConfig, result.user.email, invoiceCode)
    res.clearCookie("cart");
    res.clearCookie("sale_off");
    res.redirect(linkIndex + '/' + invoiceCode);
  });
});

module.exports = router;
