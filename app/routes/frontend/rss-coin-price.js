var express = require('express');
var router = express.Router();

const folderView	 = __path_views_blog + 'pages/rss-coin-price/';
const layoutBlog    = __path_views_blog + 'frontend';

const rp = require('request-promise');
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

/* GET home page. */
router.get('/',  async (req, res, next) => {
  rp(requestOptions).then(response => {
    let items = response.data;
    let updateTime = response.status.timestamp;
    res.render(`${folderView}index`, { 
      top_post: false,
      layout: layoutBlog,
      items,
      updateTime
    });
  }).catch((err) => {
    console.log('API call error:', err.message);
  });
});

module.exports = router;
