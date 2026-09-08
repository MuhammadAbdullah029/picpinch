const flash = (req, res, next) => {
    if (!req.session) {
        throw new Error('Flash middleware requires express-session');
    }

    req.flash = function (type, message) {
        if (!req.session.flash) req.session.flash = {};

        if (type && message !== undefined) {
            if (!Array.isArray(req.session.flash[type])) {
                req.session.flash[type] = [];
            }

            req.session.flash[type].push(message);
            return req.session.flash[type];
        }

        if (type) {
            const messages = req.session.flash[type] || [];
            delete req.session.flash[type];
            return messages;
        }

        return undefined;
    };

    res.locals.error_msg = req.flash('error_msg');
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error = req.flash('error');

    next();
};


module.exports = flash;