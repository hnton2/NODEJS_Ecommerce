var express = require('express');
var router = express.Router();

const ItemsModel 	= require(__path_schemas + 'items');
const GroupsModel 	= require(__path_schemas + 'groups');
const UsersModel 	= require(__path_schemas + 'users');
const CategoryModel 	= require(__path_schemas + 'category');

const folderView	 = __path_views_admin + 'pages/dashboard/';
const countItemHelpers 	= require(__path_helpers + 'count-items');


/* GET dashboard page. */
router.get('/', async function(req, res, next) {
  let totalItems = await countItemHelpers.countItems(ItemsModel);
  let totalGroups = await countItemHelpers.countItems(GroupsModel);
  let totalUsers = await countItemHelpers.countItems(UsersModel);
  let totalCategory = await countItemHelpers.countItems(CategoryModel);

  res.render(`${folderView}index`, { 
    pageTitle: 'Dashboard Page',
    'courseName': '<p>NodeJS</p>',
    totalItems,
    totalGroups,
    totalUsers,
    totalCategory
  });
});

module.exports = router;
