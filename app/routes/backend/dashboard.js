var express = require('express');
var router = express.Router();

const ItemsModel 	= require(__path_schemas + 'items');
const GroupsModel 	= require(__path_schemas + 'groups');
const UsersModel 	= require(__path_schemas + 'users');
const CategoryModel 	= require(__path_schemas + 'category');

const folderView	 = __path_views_admin + 'pages/dashboard/';
const UtilsHelpers 	= require(__path_helpers + 'utils');

/* GET dashboard page. */
router.get('/', async function(req, res, next) {
  let totalItems = await UtilsHelpers.countCollections(ItemsModel);
  let totalGroups = await UtilsHelpers.countCollections(GroupsModel);
  let totalUsers = await UtilsHelpers.countCollections(UsersModel);
  let totalCategory = await UtilsHelpers.countCollections(CategoryModel);

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
