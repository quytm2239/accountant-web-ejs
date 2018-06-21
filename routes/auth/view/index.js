module.exports = function(app, authRouter, config, M, sequelize) {

	var SUPER_ROLE = app.get('constants').SUPER_ROLE

	authRouter.get('/', function(req, res) {
		if (req.session.role_id == SUPER_ROLE) {
			res.redirect('/news')
		} else {
			M.AdminList.findOne({ where: { account_id: req.session.account_id } }).then(object => {
				if (object) {
					req.session.in_admin_list = true
					res.redirect('/news')
				} else {
					req.session.in_admin_list = false
					M.Department.findOne({ where: { department_id: req.session.department_id } }).then(department => {
						res.redirect(department.path)
					})
				}
			})
		}
	})

	authRouter.get('/news', function(req, res) {
		var department = []
		Promise.all([
			M.Department.findAll(),
			M.Profile.findOne({ where: { account_id: req.session.account_id } }),
			M.AdminList.findOne({ where: { account_id: req.session.account_id } })
		]).then(results => {
			// check admin's permission
			if (req.session.role_id == 777 || results[2] != null) {
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
			res.render("auth-page/news", {
				profile: currentProfile.dataValues,
				department: department,
				companyName: "Cty TNHH Phú Liên"
			})
		})
	})

	authRouter.get('/home', function(req, res) {
		var department = []
		Promise.all([
			M.Department.findAll(),
			M.Profile.findOne({ where: { account_id: req.session.account_id } }),
			M.AdminList.findOne({ where: { account_id: req.session.account_id } })
		]).then(results => {
			// check admin's permission
			if (req.session.role_id == 777 || results[2] != null) {
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
