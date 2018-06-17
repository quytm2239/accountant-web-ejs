// ---------------------------------------------------------
// Route middleware to authenticate and check token
// --------------------------------------------------------
/* /.. is back to 1 level parrent directory */
// var config = require('./../config');
// var errcode = require('./../errcode');
// var utils = require('./../utils');

module.exports = function(req, res, next) {
	console.log(req.session);
	if (req.session.account_id) {
		next();
	} else {
		res.redirect('/login');
	}
};
