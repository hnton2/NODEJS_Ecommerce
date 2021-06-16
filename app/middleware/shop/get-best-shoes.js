const ShoesModel = require(__path_models + 'shoes');

module.exports = async (req, res, next) => {
    await ShoesModel
        .listItemsFrontend(null, {task: 'best-sellers-items'})
        .then( (items) => { res.locals.bestShoes = items;});
    next();
};