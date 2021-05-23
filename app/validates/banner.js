const util  = require('util');
const notify= require(__path_configs + 'notify');

const options = {
    ordering: { min: 0, max: 100 },
    status: { value: 'allValue' },
    link: { min: 1, max: 100 },
}

module.exports = {
    validator: (req, errUpload, taskCurrent) => {

        // ORDERING
        req.checkBody('ordering', util.format(notify.ERROR_ORDERING, options.ordering.min, options.ordering.max))
            .isInt({gt: options.ordering.min, lt: options.ordering.max});
        
        // STATUS
        req.checkBody('status', notify.ERROR_STATUS)
            .isNotEqual(options.status.value);

        // LINK
        req.checkBody('link', util.format(notify.ERROR_NAME, options.link.min, options.link.max) )
            .isLength({ min: options.link.min, max: options.link.max })


        let errors = req.validationErrors() !== false ? req.validationErrors() : [];  
		if (errUpload) {
			if(errUpload.code == 'LIMIT_FILE_SIZE') {
				errUpload = notify.ERROR_FILE_LIMIT;
			};
			errors.push({param: 'thumb', msg: errUpload});
		}else {
			if(req.file == undefined && taskCurrent == "add"){
				errors.push({param: 'thumb', msg: notify.ERROR_FILE_REQUIRE});
			}
        }
        
        return errors;
    }
}