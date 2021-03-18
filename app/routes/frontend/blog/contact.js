var express = require('express');
var router = express.Router();

const ContactModel = require(__path_models + 'contact');
const NotifyHelpers		= require(__path_helpers + 'notify');
const systemConfig  	= require(__path_configs + 'system');

const folderView	 = __path_views_blog + 'pages/contact/';
const layoutBlog    = __path_views_blog + 'frontend';

/* GET home page. */
router.get('/',   async (req, res, next) => {
  res.render(`${folderView}index`, { 
    pageTitle   : 'Liên hệ',
    top_post: false,
    trending_post: false,
    layout_rss: false,
    layout_contact: true,
    layout_article: false,
    layout: layoutBlog,
  });
});

router.post('/save',   async (req, res, next) => {
  const linkIndex		 	= '/' + systemConfig.prefixBlog + `/contact/`;

  req.body = JSON.parse(JSON.stringify(req.body));
	let item = Object.assign(req.body);
	ContactModel.saveItems(item, {tasks: 'add'}).then( (result) => {
		NotifyHelpers.showNotify(req, res, linkIndex, {tasks: 'add-contact-success'});
	});
});


module.exports = router;
