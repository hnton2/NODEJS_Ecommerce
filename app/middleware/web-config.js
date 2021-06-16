const ConfigModel = require(__path_models + 'config');

module.exports = async (req, res, next) => {
    let item = [];
    await ConfigModel.getItems().then( (data) =>{
		item = data;
	});
	res.locals.webConfig = item[0];
    next();
};