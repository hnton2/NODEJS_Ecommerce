const ArticleModel = require(__path_models + 'news');

module.exports = async (req, res, next) => {
    await ArticleModel
        .listItemsFrontend(null, {task: 'items-random'})
        .then( (items) => {res.locals.itemsRandom = items;});
    next();
};