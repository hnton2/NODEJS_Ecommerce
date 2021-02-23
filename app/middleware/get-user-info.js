module.exports = (req, res, next) => {
    let userInfo1 = {};
    if(req.isAuthenticated()) {
        userInfo1 = req.user;
    }
    res.locals.userInfo = userInfo1;
    next();
};