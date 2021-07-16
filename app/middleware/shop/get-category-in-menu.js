const CategoryModel = require(__path_models + 'shoes-category');

module.exports = async (req, res, next) => {
    await CategoryModel
        .listItemsFrontend(null, {task: 'items-in-menu'})
        .then( (items) => { res.locals.itemsProductCategory = items;});
    next();
};