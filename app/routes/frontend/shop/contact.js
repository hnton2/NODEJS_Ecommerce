var express = require('express');
var router = express.Router();

const folderView	 = __path_views_shop + 'pages/contact/';
const layoutShop    = __path_views_shop + 'frontend';
const ContactModel = require(__path_models + 'contact');
const NotifyHelpers		= require(__path_helpers + 'notify');
const systemConfig  	= require(__path_configs + 'system');


/* GET home page. */
router.get('/',   async (req, res, next) => {
  res.render(`${folderView}index`, { 
    pageTitle : 'Contact',
    top_post: false,
    contact_layout: true,
    sidebar_rss: false,
    layout: layoutShop,
  });
});

router.post('/save', async (req, res, next) => {
  const linkIndex		 	= '/' + systemConfig.prefixShop + `/contact/`;

  req.body = JSON.parse(JSON.stringify(req.body));
	let item = Object.assign(req.body);
	ContactModel.saveItems(item, {tasks: 'add'}).then( (result) => {
		NotifyHelpers.showNotify(req, res, linkIndex, {tasks: 'add-contact-success'});
	});
});

module.exports = router;
