const StringHelpers  	= require(__path_helpers + 'string');
const systemConfig  	= require(__path_configs + 'system');

module.exports = async (req, res, next) => {
    const linkLogin		 	= StringHelpers.formatLink('/' + systemConfig.prefixShop + '/auth/login/');
    const linkNoPermission	= StringHelpers.formatLink('/' + systemConfig.prefixShop + '/auth/no-permission/');
    const GroupsModel 		= require(__path_models + 'groups');
    if(req.isAuthenticated()) {
        await GroupsModel.getItems({id: req.user.group.id}, {task: 'get-items-by-id'}).then((item) => {
            if(item.group_acp === 'yes') {
                next();
            } else {
                res.redirect(linkNoPermission);
            }
        });
    } else {
        res.redirect(linkLogin);
    }
};