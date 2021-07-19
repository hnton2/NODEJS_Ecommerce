var express = require('express');
var router = express.Router();
var RSSCombiner = require('rss-combiner');

const ParamsHelpers 	= require(__path_helpers + 'params');
const UtilsHelpers 		= require(__path_helpers + 'utils');

const ArticleModel = require(__path_models + 'news');
const CategoryModel = require(__path_models + 'news-category');
const RSSModel = require(__path_models + 'rss');

const folderView	 = __path_views_shop + 'pages/news-category/';
const folderViewRSS	 = __path_views_shop + 'pages/rss/';
const layoutShop    = __path_views_shop + 'frontend';

router.get('/:category/', async (req, res, next) => {
  let title = '';
  let taskCategory = '';
  let params = {};
  let itemsInCategory = [];
  let categorySlug = ParamsHelpers.getParam(req.params, 'category', '');
  let keyword		 = ParamsHelpers.getParam(req.query, 'keyword', '');
  if(keyword !== ' ') params.keyword = keyword; else   params.keyword = '';
  if(categorySlug === 'all') {
    title = 'News Category';
    taskCategory = 'all-items';
  } else if( categorySlug === 'trending') {
    title = 'Trends';
    taskCategory = 'items-trending';
  } else {
    let idCategory = '';
    taskCategory = 'items-in-category';
    await CategoryModel.getItems({slug: categorySlug}, {task: 'get-items-by-slug'}).then( (items) => {idCategory = items[0].id; title = items[0].name});
    params.id = idCategory;
  }
  await ArticleModel.listItemsFrontend(params, {task: taskCategory}).then( (item) => {itemsInCategory = item;});
  let pagination 	 = {
		totalItems		 : 1,
		totalItemsPerPage: 10,
		currentPage		 : parseInt(ParamsHelpers.getParam(req.query, 'page', 1)),
		pageRanges		 : 3,
    totalItems: itemsInCategory.length
	};
  itemsInCategory = itemsInCategory.slice((pagination.currentPage - 1) * pagination.totalItemsPerPage, pagination.currentPage * pagination.totalItemsPerPage);

  res.render(`${folderView}index`, { 
    pageTitle   : title,
    top_post: false,
    contact_layout: false,
    layout: layoutShop,
    itemsInCategory,
    categorySlug,
    keyword,
    pagination,
    params,
  });

});


router.get('/rss/fashion-news',  async (req, res, next) => {
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
    res.render(`${folderViewRSS}index`, {
      pageTitle   : 'Fashion News', 
      top_post: false,
      contact_layout: false,
      layout: layoutShop,
      itemsRSS,
      pagination,
    });
  });
});

router.get('/rss/local-news',  async (req, res, next) => {
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

    res.render(`${folderViewRSS}index-2`, {
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

module.exports = router;
