var express = require('express');
var router = express.Router();

const OrdersModel = require(__path_models + 'orders');
const PromoModel = require(__path_models + 'promo');
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
  let fee = [
      {name: 'An Giang', value: '10'},
      {name: 'Bà Rịa - Vũng Tàu', value: '3'},
      {name: 'Bắc Giang', value: '12'},
      {name: 'Bắc Kạn', value: '12'},
      {name: 'Bạc Liêu', value: '8'},
      {name: 'Bắc Ninh', value: '15'},
      {name: 'Bến Tre', value: '6'},
      {name: 'Bình Định', value: '6'},
      {name: 'Bình Dương', value: '2'},
      {name: 'Bình Phước', value: '4'},
      {name: 'Bình Thuận', value: '4'},
      {name: 'Cà Mau', value: '2'},
      {name: 'Cần Thơ', value: '3'},
      {name: 'Cao Bằng', value: '15'},
      {name: 'Đà Nẵng', value: '7'},
      {name: 'Đắk Lắk', value: '10'},
      {name: 'Đắk Nông', value: '10'},
      {name: 'Điện Biên', value: '20'},
      {name: 'Đồng Nai', value: '2'},
      {name: 'Đồng Tháp', value: '3'},
      {name: 'Gia Lai', value: '8'},
      {name: 'Hà Giang', value: '10'},
      {name: 'Hà Nam', value: '10'},
      {name: 'Hà Nội', value: '12'},
      {name: 'Hà Tĩnh', value: '11'},
      {name: 'Hải Dương', value: '13'},
      {name: 'Hải Phòng', value: '12'},
      {name: 'Hậu Giang', value: '5'},
      {name: 'Hồ Chí Minh', value: '1'},
      {name: 'Hòa Bình', value: '8'},
      {name: 'Hưng Yên', value: '6'},
      {name: 'Khánh Hòa', value: '6'},
      {name: 'Kiên Giang', value: '7'},
      {name: 'Kon Tum', value: '8'},
      {name: 'Lai Châu', value: '9'},
      {name: 'Lâm Đồng', value: '10'},
      {name: 'Lạng Sơn', value: '16'},
      {name: 'Lào Cai', value: '14'},
      {name: 'Long An', value: '3'},
      {name: 'Nam Định', value: '5'},
      {name: 'Nghệ An', value: '5'},
      {name: 'Ninh Bình', value: '4'},
      {name: 'Ninh Thuận', value: '4'},
      {name: 'Phú Thọ', value: '7'},
      {name: 'Phú Yên', value: '7'},
      {name: 'Quảng Bình', value: '16'},
      {name: 'Quảng Nam', value: '6'},
      {name: 'Quảng Ngãi', value: '6'},
      {name: 'Quảng Ninh', value: '18'},
      {name: 'Quảng Trị', value: '8'},
      {name: 'Sóc Trăng', value: '4'},
      {name: 'Sơn La', value: '20'},
      {name: 'Tây Ninh', value: '15'},
      {name: 'Thái Bình', value: '13'},
      {name: 'Thái Nguyên', value: '10'},
      {name: 'Thanh Hóa', value: '7'},
      {name: 'Thừa Thiên Huế', value: '7'},
      {name: 'Tiền Giang', value: '2'},
      {name: 'Trà Vinh', value: '4'},
      {name: 'Tuyên Quang', value: '6'},
      {name: 'Vĩnh Long', value: '4'},
      {name: 'Vĩnh Phúc', value: '5'},
      {name: 'Yên Bái', value: '8'},
  ];
  res.json(fee);
});

router.post('/save', async (req, res, next) => {
  let product = [];
  let sale_off = {};

  if(req.cookies.cart !== undefined) {
    product = JSON.parse(JSON.stringify(req.cookies.cart));
  }
  if(req.cookies.sale_off !== undefined) {
    sale_off = JSON.parse(JSON.stringify(req.cookies.sale_off));
  }

  let invoiceCode = StringHelpers.generateCode(10);
  req.body = JSON.parse(JSON.stringify(req.body));
  let user = req.body;
  
  await OrdersModel.saveItems(invoiceCode, product, user, sale_off).then( (result) => {
    EmailHelpers.sendEmail(result.user.email, invoiceCode)
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
