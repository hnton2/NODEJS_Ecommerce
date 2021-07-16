const ArticleModel = require(__path_models + 'news');

module.exports = async (req, res, next) => {
    await ArticleModel
        .listItemsFrontend(null, {task: 'items-trending'})
        .then( (items) => {res.locals.itemsTrending = items;});
    next();
};