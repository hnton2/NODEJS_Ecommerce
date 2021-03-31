var express = require('express');
var router = express.Router();
var RSSCombiner = require('rss-combiner');
const rp = require('request-promise');
const xml2js = require('xml2js');


const RSSModel = require(__path_models + 'rss');
const RSSHelpers = require(__path_helpers + 'rss');

const folderView	 = __path_views_shop + 'pages/rss/';
const layoutShop    = __path_views_shop + 'frontend';

router.get('/',  async (req, res, next) => {
  // RSS Sport
  let linkRss = [];
  let itemsRSS = [];
  await RSSModel.listItemsFrontend().then( (items) => {
    items.forEach( (item) =>{
      linkRss = [...linkRss, item.link]
    });
  });
  var feedConfig = {
    title: 'Fashion News',
    size: 40,
    feeds: linkRss,
    pubDate: new Date()
  };
  await RSSCombiner(feedConfig, function (err, combinedFeed) {
    if (err) return console.error(err);

    itemsRSS = combinedFeed.item().items;
    res.render(`${folderView}index`, {
      pageTitle   : 'Fashion News', 
      top_post: false,
      contact_layout: false,
      layout: layoutShop,
      itemsRSS
    });
  });
});

module.exports = router;
