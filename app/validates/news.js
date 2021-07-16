const util  = require('util');
const notify= require(__path_configs + 'notify');

const options = {
    name: { min: 5, max: 70 },
    slug: { min: 5, max: 70 },
    summary: { min: 5, max: 500 },
    ordering: { min: 0, max: 100 },
    status: { value: 'allValue' },
    special: { value: 'allValue' },
    trending: { value: 'allValue' },
    category: { value: 'allValue' },
    content: { min: 5, max: 20000 }
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

        // SPECIAL
        req.checkBody('special', notify.ERROR_STATUS)
            .isNotEqual(options.special.value);
        // TRENDING
        req.checkBody('trending', notify.ERROR_STATUS)
            .isNotEqual(options.trending.value);

        // GROUP
        req.checkBody('category_id', notify.ERROR_CATEGORY)
            .isNotEqual(options.category.value);

        // SUMMARY
        req.checkBody('summary', util.format(notify.ERROR_NAME, options.summary.min, options.summary.max) )
            .isLength({ min: options.summary.min, max: options.summary.max });

        // CONTENT
        req.checkBody('content', util.format(notify.ERROR_NAME, options.content.min, options.content.max) )
            .isLength({ min: options.content.min, max: options.content.max });


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