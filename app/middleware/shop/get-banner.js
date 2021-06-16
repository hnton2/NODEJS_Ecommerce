const BannerModel = require(__path_models + 'banner');

module.exports = async (req, res, next) => {
    await BannerModel
        .listItemsFrontend()
        .then( (items) => { res.locals.bannerImg = items;});
    next();
};