module.exports = function(app, authRouter, config, M, sequelize) {

	authRouter.get('/home', function(req, res) {
		var department = []
		Promise.all([
			M.Department.findAll(),
			M.Profile.findOne({ where: { account_id: req.session.account_id } }),
			M.AdminList.findOne({ where: { account_id: req.session.account_id } })
		]).then(results => {
			// check admin's permission
			if (req.session.role_id == 777 || results[2].length > 0) {
				department.push({
					name: 'Bảng Tin',
					path: '/news'
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
