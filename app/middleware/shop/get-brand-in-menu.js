const BrandModel = require(__path_models + 'brand');

module.exports = async (req, res, next) => {
    await BrandModel
        .listItemsFrontend(null, {task: 'items-in-menu'})
        .then( (items) => { res.locals.itemsBrand = items;});
    next();
};