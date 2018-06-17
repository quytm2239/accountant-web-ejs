module.exports = function(app, authRouter, config, M, sequelize) {

	var SUPER_ROLE = app.get('constants').SUPER_ROLE;
	var middleware = function(req, res, next) {
		if (req.session.account.role_id != SUPER_ROLE) {
			return res.status(403).send({
				success: false,
				message: 'Your current logged-in account is not allowed to do this action!'
			});
		} else {
			next();
		}
	};

	authRouter.get('/home', function(req, res) {
		res.render("index", {
			companyName: "Cty TNHH Phú Liên"
		});
	});
};
