
module.exports = function(passport) {
    var LocalStrategy = require('passport-local').Strategy;
    const UserModel 		= require(__path_models + 'users');
    const notify  		= require(__path_configs + 'notify');

    passport.use(new LocalStrategy(
        function(username, password, done) {
            UserModel.getItemByUsername(username, null).then( (users) => {
                let user = users[0];
                if(user === undefined  || user.length == 0) {
                    return done(null, false, {message: notify.ERROR_LOGIN});
                } else {
                    if(password !== user.password) {
                        return done(null, false, {message: notify.ERROR_LOGIN});
                    } else {
                        return done(null, user, {message: notify.ERROR_LOGIN});
                    }
                }
            });
        }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });
    
    passport.deserializeUser(function(id, done) {
        UserModel.getItems(id, null).then( (user) => {
            done(null, user);
        });
    });
};