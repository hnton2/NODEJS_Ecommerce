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
    special: { value: 'allValue' },
    category: { value: 'allValue' },
    content: { min: 5, max: 20000 },
    color: { min: 1},
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
        req.checkBody('price', util.format(notify.ERROR_PRICE, options.price.min))
        .isInt({gt: options.price.min});

        // QUANTITY
        req.checkBody('quantity', util.format(notify.ERROR_QUANTITY, options.quantity.min))
            .isInt({gt: options.quantity.min});        
        
        // STATUS
        req.checkBody('status', notify.ERROR_STATUS)
            .isNotEqual(options.status.value);

         // STATUS
         req.checkBody('special', notify.ERROR_STATUS)
            .isNotEqual(options.special.value);

        // CATEGORY
        req.checkBody('category_id', notify.ERROR_CATEGORY)
            .isNotEqual(options.category.value);

        // CONTENT
        req.checkBody('content', util.format(notify.ERROR_NAME, options.content.min, options.content.max) )
            .isLength({ min: options.content.min, max: options.content.max });

        // COLOR
        req.checkBody('color', util.format(notify.ERROR_COLOR, options.color.min))
            .isLength({ min: options.color.min});

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