const util  = require('util');
const notify= require(__path_configs + 'notify');

const options = {
    name: { min: 2, max: 30 },
    code: { min: 5, max: 10 },
    price: { min: 0},
    status: { value: 'allValue' },
    amount: { min: 0},
    content: { min: 5, max: 2000 }
}

module.exports = {
    validator: (req) => {
        // NAME
        req.checkBody('name', util.format(notify.ERROR_NAME, options.name.min, options.name.max) )
            .isLength({ min: options.name.min, max: options.name.max })

        // CODE
        req.checkBody('code', util.format(notify.ERROR_NAME, options.code.min, options.code.max) )
            .isLength({ min: options.code.min, max: options.code.max })

        // PRICE
        req.checkBody('price', util.format(notify.ERROR_PRICE, options.price.min))
            .isInt({gt: options.price.min});
        
        // STATUS
        req.checkBody('status', notify.ERROR_STATUS)
            .isNotEqual(options.status.value);

        // AMOUNT
        req.checkBody('amount', util.format(notify.ERROR_QUANTITY, options.amount.min))
            .isInt({gt: options.amount.min});

        // CONTENT 
        req.checkBody('content', util.format(notify.ERROR_NAME, options.content.min, options.content.max) )
            .isLength({ min: options.content.min, max: options.content.max })
    }
}