module.exports = function(app, authRouter, config, M, sequelize) {

	var ADMIN_HOME_PATH = app.get('constants').ADMIN_HOME_PATH
	var ADMIN_HOME_PATH_NAME = app.get('constants').ADMIN_HOME_PATH_NAME

	authRouter.get('/member-approve', function(req, res) {
		var department = []

		Promise.all([
			M.Department.findAll(),
			M.Profile.findOne({ where: { account_id: req.session.account_id } }),
			M.AdminList.findOne({ where: { account_id: req.session.account_id } })
		]).then(results => {
			// check admin's permission
			if (req.session.role_id == 777 || results[2].length > 0) {
				department.push({
					name: ADMIN_HOME_PATH_NAME,
					path: ADMIN_HOME_PATH
				})
			}
			// create nav bar item
			results[0].forEach(elem => {
				department.push({
					name: elem.dataValues.name,
					path: elem.dataValues.path
				})
			});

			// get current profile
			var currentProfile = results[1]

			res.render("home", {
				profile: currentProfile.dataValues,
				department: department,
				companyName: "Cty TNHH Phú Liên"
			})
		})
	})
}
