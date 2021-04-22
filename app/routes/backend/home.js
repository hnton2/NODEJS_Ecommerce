var express = require('express');
var router = express.Router();

const folderView	 = __path_views_admin + 'pages/home/';

const OrderSchemas 	= require(__path_schemas + 'orders');
const ContactSchemas	= require(__path_schemas + 'contact');
const ShoesModel 	= require(__path_models + 'shoes');
const OrdersModel 	= require(__path_models + 'orders');
const ContactModel 	= require(__path_models + 'contact');


const UtilsHelpers 	= require(__path_helpers + 'utils');

/* GET home page. */
router.get('/', async function(req, res, next) {
  let nInventory = 0;
  let nSales = 0;
  let lastedContact = [];
  let lastedOrders = [];
  let lastedShoes = [];

  let totalOrders = await UtilsHelpers.countCollections(OrderSchemas);
  let totalContact = await UtilsHelpers.countCollections(ContactSchemas);
  await ShoesModel.countingInventory().then((item) => { nInventory = item[0].quantity; });
  await OrdersModel.countingSales().then((item) => { nSales = item[0].total; });
  await OrdersModel.getItems(null, {task: 'lasted-item'}).then( (item) => { lastedOrders = item; });
  await ContactModel.getItems(null, {task: 'lasted-item'}).then( (item) => { lastedContact = item; });
  await ShoesModel.listItemsFrontend(null, {task: 'lasted-item'}).then((item) => { lastedShoes = item; });

  res.render(`${folderView}index`, { 
    pageTitle   : 'HomePage',
    totalOrders,
    totalContact,
    nInventory,
    nSales,
    lastedContact,
    lastedOrders,
    lastedShoes,
  });
});

module.exports = router;
