var express = require('express');
var router = express.Router();

const OrdersModel = require(__path_models + 'orders');
const PromoModel = require(__path_models + 'promo');
const ShippingModel = require(__path_models + 'shipping');
const ConfigModel = require(__path_models + 'config');
const StringHelpers   = require(__path_helpers + 'string');
const EmailHelpers		= require(__path_helpers + 'email');

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
    sale_off = req.cookies.sale_off.saleOff;
  }
  res.render(`${folderView}index`, {
    pageTitle : 'Checkout',
    top_post: false,
    contact_layout: false,
    sidebar_rss: false,
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

  if(req.cookies.cart !== undefined) { product = JSON.parse(JSON.stringify(req.cookies.cart));}
  if(req.cookies.sale_off !== undefined) { sale_off = JSON.parse(JSON.stringify(req.cookies.sale_off)); }
  let invoiceCode = StringHelpers.generateCode(10);
  let user = JSON.parse(JSON.stringify(req.body));

  let emailConfig = [];
  await ConfigModel.getEmail().then( (items) => { emailConfig = items[0]});

  await OrdersModel.saveItems(invoiceCode, product, user, sale_off).then( (result) => {
    EmailHelpers.sendEmail(emailConfig, result.user.email, invoiceCode)
    res.clearCookie("cart");
    res.clearCookie("sale_off");
    res.redirect(linkIndex + '/' + invoiceCode);
  });
});

router.post('/apply-promo-code', async (req, res, next) => {
  req.body = JSON.parse(JSON.stringify(req.body));
  let item = req.body;
  let saleOff = 0;
  await PromoModel.applyPromo(item.code).then( (item) => {
    saleOff = item.price;
  });
  res.cookie('sale_off', {code: item.code, saleOff: saleOff});
  res.json({saleOff: saleOff, message: 'Apply success'});
});

module.exports = router;
