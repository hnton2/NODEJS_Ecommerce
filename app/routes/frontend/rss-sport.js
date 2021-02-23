var express = require('express');
var router = express.Router();

const RSSModel = require(__path_models + 'rss');
const RSSHelpers = require(__path_helpers + 'rss');

const folderView	 = __path_views_blog + 'pages/rss/';
const layoutBlog    = __path_views_blog + 'frontend';

/* GET home page. */
router.get('/',  async (req, res, next) => {
  // RSS Sport
  let linkSport = [];
  await RSSModel.listItemsFrontend().then( (items) => {linkSport = items;});
  await RSSHelpers.xmlToJson(linkSport[0].link, (err, data) => {
    if (err) { return console.err(err); }
    let itemsSport = data.rss.channel[0].item;
    res.render(`${folderView}index`, { 
      top_post: false,
      layout: layoutBlog,
      itemsSport
    });
  });
});

module.exports = router;
