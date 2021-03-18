const util  = require('util');
const notify= require(__path_configs + 'notify');

const options = {
    name: { min: 2, max: 30 },
    email: { min: 5, max: 100 },
    status: { value: 'allValue' },
    phone: {  min: 5, max: 20 },
    message: { min: 1, max: 500 }
}

module.exports = {
    validator: (req) => {
        // NAME
        req.checkBody('name', util.format(notify.ERROR_NAME, options.name.min, options.name.max) )
            .isLength({ min: options.name.min, max: options.name.max })
        
        // Email
        req.checkBody('email', util.format(notify.ERROR_EMAIL, options.email.min, options.email.max) )
        .isLength({ min: options.email.min, max: options.email.max })
        
        // STATUS
        req.checkBody('status', notify.ERROR_STATUS)
            .isNotEqual(options.status.value);
        
        // Phone
        req.checkBody('phone', util.format(notify.ERROR_PHONE, options.phone.min, options.phone.max) )
        .isLength({ min: options.phone.min, max: options.phone.max })

        // Message
        req.checkBody('message', util.format(notify.ERROR_MESSAGE, options.message.min, options.message.max) )
            .isLength({ min: options.message.min, max: options.message.max });
    }
}