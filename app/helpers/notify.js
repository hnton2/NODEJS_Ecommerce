const util          = require('util');
const notify  		= require(__path_configs + 'notify');


let showNotify = (req, res, linkIndex, params = null) => {
    let notifyContent = '';
    switch(params.tasks) {
        case 'change-status-success':
            notifyContent = notify.CHANGE_STATUS_SUCCESS;
            break;
        case 'change-status-multi-success':
            notifyContent = util.format(notify.CHANGE_STATUS_MULTI_SUCCESS, params.n);
            break;
        case 'change-special-success':
            notifyContent = notify.CHANGE_SPECIAL_SUCCESS;
            break;
        case 'change-special-multi-success':
            notifyContent = util.format(notify.CHANGE_SPECIAL_MULTI_SUCCESS, params.n);
            break;
        case 'change-ordering-success':
            notifyContent = notify.CHANGE_ORDERING_SUCCESS;
            break;
        case 'delete-success':
            notifyContent = notify.DELETE_SUCCESS;
            break;
        case 'delete-multi-success':
            notifyContent = util.format(notify.DELETE_MULTI_SUCCESS, params.n);
            break;
        case 'edit-success':
            notifyContent = notify.EDIT_SUCCESS;
            break;
        case 'add-success':
            notifyContent = notify.ADD_SUCCESS;
            break;
        case 'change-group-acp-success':
            notifyContent = notify.CHANGE_GROUP_ACP_SUCCESS;
            break;
    }

    req.flash('success', notifyContent);
	res.redirect(linkIndex);
}

module.exports = {
    showNotify
}