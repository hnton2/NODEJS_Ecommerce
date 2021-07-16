var express = require('express');
var router = express.Router();
var RSSCombiner = require('rss-combiner');
const rp = require('request-promise');
var weather = require('openweather-apis');
const { all } = require('./news-category');

const RSSModel = require(__path_models + 'rss');
const RSSHelpers = require(__path_helpers + 'rss');
const UtilsHelpers 		= require(__path_helpers + 'utils');
const ParamsHelpers 	= require(__path_helpers + 'params');

const folderView	 = __path_views_shop + 'pages/rss/';
const layoutShop    = __path_views_shop + 'frontend';

router.get('/',  async (req, res, next) => {
  let linkRss = [];
  let itemsRSS = [];
  await RSSModel.listItemsFrontend().then( (items) => {
    items.forEach( (item) =>{
      linkRss = [...linkRss, item.link]
    });
  });
  var feedConfig = {
    title: 'Fashion News',
    size: 1000,
    feeds: linkRss,
    pubDate: new Date()
  };
  let pagination 	 = {
		totalItems		 : 1,
		totalItemsPerPage: 18,
		currentPage		 : parseInt(ParamsHelpers.getParam(req.query, 'page', 1)),
		pageRanges		 : 3,
	};
  await RSSCombiner(feedConfig, function (err, combinedFeed) {
    if (err) return console.error(err);
    itemsRSS = combinedFeed.item().items;
    itemsRSS = itemsRSS.slice(0, -1);
    pagination.totalItems = itemsRSS.length;
    itemsRSS = itemsRSS.slice((pagination.currentPage - 1) * pagination.totalItemsPerPage, pagination.currentPage * pagination.totalItemsPerPage);
    itemsRSS = UtilsHelpers.shuffleArray(itemsRSS);
    res.render(`${folderView}index`, {
      pageTitle   : 'Fashion News', 
      top_post: false,
      contact_layout: false,
      layout: layoutShop,
      itemsRSS,
      pagination,
    });
  });
});

router.get('/local-news',  async (req, res, next) => {
  let itemsRSS = [];
  var feedConfig = {
    title: 'Local News',
    size: 1000,
    feeds: [
      'http://e.vnexpress.net/rss/sports.rss',
      'http://e.vnexpress.net/rss/perspectives.rss',
      'http://e.vnexpress.net/rss/life.rss',
      'http://e.vnexpress.net/rss/travel.rss',
      'http://e.vnexpress.net/rss/business.rss',
      'http://e.vnexpress.net/rss/news.rss'
    ],
    pubDate: new Date()
  };

  let pagination 	 = {
		totalItems		 : 1,
		totalItemsPerPage: 18,
		currentPage		 : parseInt(ParamsHelpers.getParam(req.query, 'page', 1)),
		pageRanges		 : 3,
	};

  await RSSCombiner(feedConfig, function (err, combinedFeed) {
    if (err) return console.error(err);
    itemsRSS = combinedFeed.item().items;

    itemsRSS = itemsRSS.slice(0, -1);
    pagination.totalItems = itemsRSS.length;
    itemsRSS = itemsRSS.slice((pagination.currentPage - 1) * pagination.totalItemsPerPage, pagination.currentPage * pagination.totalItemsPerPage);
    itemsRSS = UtilsHelpers.shuffleArray(itemsRSS);

    res.render(`${folderView}index-2`, {
      pageTitle   : 'Local News', 
      top_post: false,
      contact_layout: false,
      layout: layoutShop,
      categorySlug: 'all',
      keyword: '',
      itemsRSS,
      pagination,
    });
  });
});

// Get gold
router.get('/get-gold',  async (req, res, next) => {
  let linkGoldPrice = 'http://www.giavangsjc.com/nd5/getrss.html/?param=4250LShvX0dUeERk';
  await RSSHelpers.xmlToJson(linkGoldPrice, (err, data) => {
    console.log(data)
    if (err) { return console.err(err); }
    let items = data.root.ratelist[0].city[0].item;
    res.json(items);
  });
});

// Get coin
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
// get-weather 
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
