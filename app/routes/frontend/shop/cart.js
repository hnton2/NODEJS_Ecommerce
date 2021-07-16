var express = require('express');
var router = express.Router();

const ShoesModel = require(__path_models + 'shoes');
const ClothingModel = require(__path_models + 'clothing');
const AccessoryModel = require(__path_models + 'accessory');
const PromoModel = require(__path_models + 'promo');
const ParamsHelpers 	= require(__path_helpers + 'params');
const UtilsHelpers 	= require(__path_helpers + 'utils');

const folderView	 = __path_views_shop + 'pages/cart/';
const layoutShop    = __path_views_shop + 'frontend';
const linkIndex     = '/cart/';

router.post('/add-to-cart', async (req, res, next) => {
  let item = [];
  let cart = [];
  let typeName = '';
  let isExist = false;
  let cookie = req.cookies.cart;

  req.body = JSON.parse(JSON.stringify(req.body));
  await ShoesModel.getItems(req.body.id).then( (data) => {  if(data) {item = data; typeName = 'shoes';}  });
  await ClothingModel.getItems(req.body.id).then( (data) => {  if(data) {item = data; typeName = 'clothing'}  });
  await AccessoryModel.getItems(req.body.id).then( (data) => {  if(data) {item = data; typeName = 'accessory'}    });

  if(cookie === undefined) {
    cart.push({ id: req.body.id, name: item.name, quantity: req.body.quantity, size: req.body.size, price: item.price - (item.price * (item.sale_off/100)), thumb: item.thumb[0], product_type: typeName, slug: item.slug });
  } else {
    cart = cookie;
    for(let i = 0; i < cart.length; i++) {
      if(req.body.id === cart[i].id && req.body.size === cart[i].size) {
        isExist = true;
        cart[i].quantity = Number(cart[i].quantity) + Number(req.body.quantity);
      }
    }
    if(isExist === false) cart.push({ id: req.body.id, name: item.name, quantity: req.body.quantity, size: req.body.size, price: item.price - (item.price * (item.sale_off/100)), thumb: item.thumb[0], product_type: typeName, slug: item.slug });
  }
  res.cookie('cart', cart);
  res.json(cart);
});

router.get('/', async (req, res, next) => {
  let items = [];
  if(req.cookies.cart !== undefined) {
    items = req.cookies.cart;
  }
  res.render(`${folderView}index`, {
    pageTitle : 'Cart',
    top_post: false,
    contact_layout: false,
    layout: layoutShop,
    items,
  });
});

// Delete
router.get('/delete/:id', (req, res, next) => {
	let id				= ParamsHelpers.getParam(req.params, 'id', '');
  let items = req.cookies.cart;
  for(let i = 0; i < items.length; i++) {
    if(id === items[i].id) items.splice(i, 1);
  }
  res.cookie('cart', items);
  res.redirect(linkIndex);
});

// change-quantity
router.post('/change-quantity-:state/:id', (req, res, next) => {
	let id				  = ParamsHelpers.getParam(req.params, 'id', '');
  let state				= ParamsHelpers.getParam(req.params, 'state', '');
  let value       = (state === 'increase') ? 1 : -1;
  let items = req.cookies.cart;
  for(let i = 0; i < items.length; i++) {
    if(id === items[i].id) {
      items[i].quantity = Number(items[i].quantity) + value;
    }
  }
  res.cookie('cart', items);
  res.json({message: "Change quantity success !!!"});
});

router.post('/apply-promo-code', async (req, res, next) => {
  req.body = JSON.parse(JSON.stringify(req.body));
	let item = Object.assign(req.body); 
  let discount = 0;
  let textMessage = 'This code is Invalid ';
  await PromoModel.getItems({code: item.discount_code}, {task: 'get-items-by-code-name'}).then( async (item) => {
    if(item[0] !== undefined && UtilsHelpers.validCode(item[0])) {
      discount = item[0].price;
      textMessage = `You get a $${discount} discount on your bill`;
      res.cookie('sale_off', {code: item[0].code, discount: discount});
    }
  });
  res.json({discount: discount, message: textMessage});
});

module.exports = router;
