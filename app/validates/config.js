const util  = require('util');
const notify= require(__path_configs + 'notify');

const options = {
    name_website: { min: 5, max: 30 },
    email: { min: 5, max: 50 },
    password_email: { min: 5, max: 30 },
    hotline: { min: 6, max: 20 },
    address: { min: 10, max: 100 },
    facebook: { min: 10, max: 100 },
    instagram: { min: 10, max: 100 },
    twitter: { min: 10, max: 100 },
    map: { min: 10, max: 300 },
    about: { min: 0, max: 2000 }
}

module.exports = {
    validator: (req, errUpload, taskCurrent) => {
        // name_website
        req.checkBody('name_website', util.format(notify.ERROR_NAME, options.name_website.min, options.name_website.max) )
            .isLength({ min: options.name_website.min, max: options.name_website.max })

        // email
        req.checkBody('email', util.format(notify.ERROR_NAME, options.email.min, options.email.max) )
            .isLength({ min: options.email.min, max: options.email.max })
        
        // password_email
        req.checkBody('password_email', util.format(notify.ERROR_NAME, options.password_email.min, options.password_email.max) )
        .isLength({ min: options.password_email.min, max: options.password_email.max })

        // hotline
        req.checkBody('hotline', util.format(notify.ERROR_NAME, options.hotline.min, options.hotline.max) )
            .isLength({ min: options.hotline.min, max: options.hotline.max })

        // address
        req.checkBody('address', util.format(notify.ERROR_NAME, options.address.min, options.address.max) )
            .isLength({ min: options.address.min, max: options.address.max })

        // facebook
        req.checkBody('facebook', util.format(notify.ERROR_NAME, options.facebook.min, options.facebook.max) )
            .isLength({ min: options.facebook.min, max: options.facebook.max })

        // instagram
        req.checkBody('instagram', util.format(notify.ERROR_NAME, options.instagram.min, options.instagram.max) )
            .isLength({ min: options.instagram.min, max: options.instagram.max })

        // twitter
        req.checkBody('twitter', util.format(notify.ERROR_NAME, options.twitter.min, options.twitter.max) )
            .isLength({ min: options.twitter.min, max: options.twitter.max })
        

        // map
        req.checkBody('map', util.format(notify.ERROR_NAME, options.map.min, options.map.max) )
            .isLength({ min: options.map.min, max: options.map.max });

        // CONTENT
        req.checkBody('about', util.format(notify.ERROR_NAME, options.about.min, options.about.max) )
            .isLength({ min: options.about.min, max: options.about.max });


        let errors = req.validationErrors() !== false ? req.validationErrors() : [];  
		if (errUpload) {
			if(errUpload.code == 'LIMIT_FILE_SIZE') {
				errUpload = notify.ERROR_FILE_LIMIT;
			};
			errors.push({param: 'logo', msg: errUpload});
		}else {
			if(req.file == undefined && taskCurrent == "add"){
				errors.push({param: 'logo', msg: notify.ERROR_FILE_REQUIRE});
			}
        }
        
        return errors;
    }
}