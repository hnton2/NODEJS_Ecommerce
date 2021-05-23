const util  = require('util');
const notify= require(__path_configs + 'notify');

const options = {
    name: { min: 2, max: 30 },
    ordering: { min: 0, max: 100 },
    status: { value: 'allValue' },
    slug: { min: 2, max: 30 },
}

module.exports = {
    validator: (req, errUpload, taskCurrent) => {
        // NAME
        req.checkBody('name', util.format(notify.ERROR_NAME, options.name.min, options.name.max) )
            .isLength({ min: options.name.min, max: options.name.max });

        req.checkBody('slug', util.format(notify.ERROR_SLUG, options.slug.min, options.slug.max) )
        .isLength({ min: options.slug.min, max: options.slug.max });

        // ORDERING
        req.checkBody('ordering', util.format(notify.ERROR_ORDERING, options.ordering.min, options.ordering.max))
            .isInt({gt: options.ordering.min, lt: options.ordering.max});
        
        // STATUS
        req.checkBody('status', notify.ERROR_STATUS)
            .isNotEqual(options.status.value);


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