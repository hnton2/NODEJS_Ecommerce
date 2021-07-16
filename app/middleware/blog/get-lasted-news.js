const ArticleModel = require(__path_models + 'news');

module.exports = async (req, res, next) => {
    await ArticleModel
    .listItemsFrontend(null, {task: 'items-news'})
    .then( (items) => {res.locals.lastedItems = items;});
    next();
};