var express = require('express');
var router = express.Router();

const OrdersModel = require(__path_models + 'orders');
const ParamsHelpers 	= require(__path_helpers + 'params');

const folderView	 = __path_views_shop + 'pages/orders-tracking/';
const layoutShop    = __path_views_shop + 'frontend';

router.get('/confirm/:id', async (req, res, next) => {
  let idOrder = ParamsHelpers.getParam(req.params, 'id', '');

  res.render(`${folderView}confirmation`, {
    pageTitle : 'Confirm',
    top_post: false,
    contact_layout: false,
    layout: layoutShop,
    idOrder,
  });
});


router.get('/', async (req, res, next) => {
  let query = ParamsHelpers.getParam(req.query, 'code', '');
  let item = [];
  let titlePage = 'Order tracking';
  if(query) titlePage = 'Invoice #' + query;
  await OrdersModel.getItems({code: query}, {task: 'get-items-by-code-order'}).then( (data) => { item = data; });

  res.render(`${folderView}index`, {
    pageTitle : titlePage,
    top_post: false,
    contact_layout: false,
    layout: layoutShop,
    query,
    item,
  });
});

module.exports = router;
