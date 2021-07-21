var express = require('express');
var router = express.Router();
var RSSCombiner = require('rss-combiner');
const rp = require('request-promise');
var weather = require('openweather-apis');
const { all } = require('./news-category');

const RSSHelpers = require(__path_helpers + 'rss');

// Get gold
router.get('/get-gold',  async (req, res, next) => {
  let linkGoldPrice = 'http://www.giavangsjc.com/nd5/getrss.html/?param=4250LShvX0dUeERk';
  await RSSHelpers.xmlToJson(linkGoldPrice, (err, data) => {
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
