var express = require('express');
var router = express.Router();
var RSSCombiner = require('rss-combiner');
var weather = require('openweather-apis');
const rp = require('request-promise');

const RSSModel = require(__path_models + 'rss');
const RSSHelpers = require(__path_helpers + 'rss');

const folderView	 = __path_views_blog + 'pages/rss/';
const layoutBlog    = __path_views_blog + 'frontend';

router.get('/',  async (req, res, next) => {
  // RSS Sport
  let linkRss = [];
  let itemsRSS = [];
  await RSSModel.listItemsFrontend().then( (items) => {
    items.forEach( (item) =>{
      linkRss.push(item._doc.link);
    });
  });
  var feedConfig = {
    title: 'Tech news from Guardian and BBC',
    size: 20,
    feeds: linkRss,
    pubDate: new Date()
  };
  await RSSCombiner(feedConfig, function (err, combinedFeed) {
    if (err) return console.error(err);
    itemsRSS = combinedFeed.item().items;
    res.render(`${folderView}index`, {
      pageTitle   : 'Tin tức tổng hợp', 
      top_post: false,
      trending_post: false,
      layout_rss: true,
      layout_contact: false,
      layout_article: false,
      layout: layoutBlog,
      itemsRSS
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

router.get('/get-weather',  async (req, res, next) => {
	
	// or set city by ID (recommended by OpenWeatherMap)
	weather.setCityId(1580578);
	// check http://openweathermap.org/appid#get for get the APPID
 	weather.setAPPID('6ea1b70b5916cd3fb0824968a7a0cc18');
  // get all the JSON file returned from server (rich of info)
	weather.getAllWeather(function(err, JSONObj){
    res.json(JSONObj);
	});
});

module.exports = router;
