const util  = require('util');
const notify= require(__path_configs + 'notify');

const options = {
    name: { min: 2, max: 100 },
    slug: { min: 2, max: 100 },
    brand: { value: 'allValue' },
    ordering: { min: 0, max: 100 },
    price: { min: 0},
    quantity: { min: 0 },
    status: { value: 'allValue' },
    category: { value: 'allValue' },
    content: { min: 5, max: 20000 }
}

module.exports = {
    validator: (req, errUpload, taskCurrent) => {
        // NAME
        req.checkBody('name', util.format(notify.ERROR_NAME, options.name.min, options.name.max) )
            .isLength({ min: options.name.min, max: options.name.max });
        // SLUG
        req.checkBody('slug', util.format(notify.ERROR_SLUG, options.slug.min, options.slug.max) )
        .isLength({ min: options.slug.min, max: options.slug.max });

        // BRAND
        req.checkBody('brand_id', notify.ERROR_CATEGORY)
            .isNotEqual(options.brand.value);

        // ORDERING
        req.checkBody('ordering', util.format(notify.ERROR_ORDERING, options.ordering.min, options.ordering.max))
            .isInt({gt: options.ordering.min, lt: options.ordering.max});
        
        // PRICE
        req.checkBody('price', util.format(notify.ERROR_PRICE, options.ordering.min, options.ordering.max))
        .isInt({gt: options.ordering.min});
        
        // QUANTITY
        req.checkBody('quantity', util.format(notify.ERROR_QUANTITY, options.ordering.min, options.ordering.max))
            .isInt({gt: options.ordering.min});
        
        // STATUS
        req.checkBody('status', notify.ERROR_STATUS)
            .isNotEqual(options.status.value);

        // CATEGORY
        req.checkBody('category_id', notify.ERROR_CATEGORY)
            .isNotEqual(options.category.value);

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
			if(req.files == undefined && taskCurrent == "add"){
				errors.push({param: 'thumb', msg: notify.ERROR_FILE_REQUIRE});
			}
        }
        
        return errors;
    }
}