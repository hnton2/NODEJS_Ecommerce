var express = require('express');
var router = express.Router();

const rp = require('request-promise');

const RSSModel = require(__path_models + 'rss');
const RSSHelpers = require(__path_helpers + 'rss');

const folderView	 = __path_views_blog + 'pages/rss/';
const layoutBlog    = __path_views_blog + 'frontend';

router.get('/',  async (req, res, next) => {
  // RSS Sport
  let linkSport = [];
  await RSSModel.listItemsFrontend().then( (items) => {linkSport = items;});
  // kiểm tra có link chưa ????
  await RSSHelpers.xmlToJson(linkSport[0].link, (err, data) => {
    if (err) { return console.err(err); }
    let itemsSport = data.rss.channel[0].item;
    res.render(`${folderView}index`, {
      pageTitle   : 'RSS', 
      top_post: false,
      layout_rss: true,
      layout: layoutBlog,
      itemsSport
    });
  });
});

router.get('/get-gold',  async (req, res, next) => {
  let linkGoldPrice = 'https://www.sjc.com.vn/xml/tygiavang.xml';
  await RSSHelpers.xmlToJson(linkGoldPrice, (err, data) => {
    if (err) { return console.err(err); }
    let items = data.root.ratelist[0].city[0].item;
    res.json(items);
  });
});

/* GET home page. */
router.get('/get-coin',  async (req, res, next) => {
  const requestOptions = {
    method: 'GET',
    uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
    qs: {
      'start': '1',
      'limit': '10',
      'convert': 'USD'
    },
    headers: {
      'X-CMC_PRO_API_KEY': 'bb129328-838d-47b9-82ca-ef46aa4d0e62'
    },
    json: true,
    gzip: true
  };
  rp(requestOptions).then(response => {
    res.json(response.data);
  }).catch((err) => {
    console.log('API call error:', err.message);
  });
});

module.exports = router;
