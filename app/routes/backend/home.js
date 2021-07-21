var express = require('express');
var router = express.Router();

const folderView	 = __path_views_admin + 'pages/home/';

const OrderSchemas 	= require(__path_schemas + 'orders');
const ContactSchemas	= require(__path_schemas + 'contact');
const ShoesModel 	= require(__path_models + 'shoes');
const ClothingModel 	= require(__path_models + 'clothing');
const AccessoryModel 	= require(__path_models + 'accessory');
const OrdersModel 	= require(__path_models + 'orders');
const ContactModel 	= require(__path_models + 'contact');

const UtilsHelpers 	= require(__path_helpers + 'utils');

/* GET home page. */
router.get('/', async function(req, res, next) {
  let nProducts = 0;
  let nSales = 0;
  let lastedContact = [];
  let lastedOrders = [];
  let lastedShoes = [];

  let totalOrders = await UtilsHelpers.countCollections(OrderSchemas);
  let totalContact = await UtilsHelpers.countCollections(ContactSchemas);
  await ShoesModel.countItems(null, {task: 'all-items-server'}).then((data) => { nProducts += data; });
  await AccessoryModel.countItems(null, {task: 'all-items-server'}).then((data) => { nProducts += data; });
  await ClothingModel.countItems(null, {task: 'all-items-server'}).then((data) => { nProducts += data; });

  await OrdersModel.countingSales().then((item) => { nSales = item[0].total; });
  await OrdersModel.getItems(null, {task: 'lasted-item'}).then( (item) => { lastedOrders = item; });
  await ContactModel.getItems(null, {task: 'lasted-item'}).then( (item) => { lastedContact = item; });
  await ShoesModel.listItemsFrontend(null, {task: 'lasted-item'}).then((item) => { lastedShoes = item; });

  let items = [];
  await ShoesModel.listItemsFrontend(null, {task: 'best-sellers-items'}).then( (data) => {items = items.concat(data);});
  await AccessoryModel.listItemsFrontend(null, {task: 'best-sellers-items'}).then( (data) => {items = items.concat(data);});
  await ClothingModel.listItemsFrontend(null, {task: 'best-sellers-items'}).then( (data) => {items = items.concat(data);});
  items = UtilsHelpers.shuffleArray(items);
  items = items.slice(0, 5);

  res.render(`${folderView}index`, { 
    pageTitle   : 'Home',
    totalOrders,
    totalContact,
    nProducts,
    nSales,
    lastedContact,
    lastedOrders,
    lastedShoes,
    items,
  });
});

module.exports = router;
