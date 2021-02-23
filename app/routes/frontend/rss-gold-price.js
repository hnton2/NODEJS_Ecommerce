var express = require('express');
var router = express.Router();

const RSSHelpers = require(__path_helpers + 'rss');

const folderView	 = __path_views_blog + 'pages/rss-gold-price/';
const layoutBlog    = __path_views_blog + 'frontend';

/* GET home page. */
router.get('/',  async (req, res, next) => {
  let linkGoldPrice = 'https://www.sjc.com.vn/xml/tygiavang.xml';
  await RSSHelpers.xmlToJson(linkGoldPrice, (err, data) => {
    if (err) { return console.err(err); }
    let items = data.root.ratelist[0].city[0].item;
    let itemInfo = data.root.ratelist[0]['$'];
    let address = data.root.ratelist[0].city[0]['$'].name;
    res.render(`${folderView}index`, { 
      top_post: false,
      layout: layoutBlog,
      itemInfo,
      address,
      items
    });
  });
});

module.exports = router;
