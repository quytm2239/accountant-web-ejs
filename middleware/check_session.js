// ---------------------------------------------------------
// Route middleware to authenticate and check token
// --------------------------------------------------------
/* /.. is back to 1 level parrent directory */
// var config = require('./../config');
// var errcode = require('./../errcode');
// var utils = require('./../utils');

module.exports = function(req, res, next) {
	if (req.session.accountId) {
        next();
    } else {
        res.redirect('/login');
    }
};

/*
module.exports = function(req, res, next) {

    var username = req.session.username;
    var email = req.session.email;
    var hashedPassword = req.session.hashedPassword;

    if (utils.chkObj(username) && utils.chkObj(email) && utils.chkObj(hashedPassword)) {
        ORM.Account.findOne({ where:
            {
                username: username,
                email:email,
                password:hashedPassword
            }
        }).then(account => {
            if (account) {
                next();
            } else {
                res.redirect('/login');
            }
        });
    } else {
        res.redirect('/login');
    }
};
*/
