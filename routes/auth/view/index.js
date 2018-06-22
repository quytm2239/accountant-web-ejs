module.exports = function(app, authRouter, config, M, sequelize) {

	var SUPER_ROLE = app.get('constants').SUPER_ROLE
	var ADMIN_HOME_PATH = app.get('constants').ADMIN_HOME_PATH
	var ADMIN_HOME_PATH_NAME = app.get('constants').ADMIN_HOME_PATH_NAME
	var COMPANY_NAME = app.get('constants').COMPANY_NAME
	var ADMIN_PATH_ICON = app.get('constants').ADMIN_PATH_ICON

	var functionList = []
	M.Function.findAll().then(list => {
		functionList = list
	})

	authRouter.get('/', function(req, res) {
		res.redirect(req.session.home_path)
	})

	authRouter.get([ADMIN_HOME_PATH,'/acc','/hr','/sec'], function(req, res) {
		var department = []
		Promise.all([
			M.Department.findAll(),
			M.Profile.findOne({ where: { account_id: req.session.account_id } }),
			// M.Function.find({ where: { department_id : req.session.department_id } })
			//M.AdminList.findOne({ where: { account_id: req.session.account_id } })
		]).then(results => {
			var funcItem = []
			if (functionList) {
				functionList.forEach(elem => {
					if (req.session.department_id == elem.dataValues.department_id) {
						funcItem.push(elem.dataValues)
					} else if (req.session.role_id == SUPER_ROLE && req.session.role_id == elem.dataValues.department_id) {
						// this for admin role: 777
						funcItem.push(elem.dataValues)
					}
				});
			}
			// create nav bar item
			// check admin's permission
			if (req.session.home_path == ADMIN_HOME_PATH) {
				department.push({
					name: ADMIN_HOME_PATH_NAME,
					path: ADMIN_HOME_PATH,
					active: req.path == ADMIN_HOME_PATH ? 'active' : '',
					icon: ADMIN_PATH_ICON,
					main: true,
				})
			}

			results[0].forEach(elem => {
				department.push({
					name: elem.dataValues.name,
					path: elem.dataValues.path,
					active: elem.dataValues.path == req.path ? 'active' : '',
					icon: elem.dataValues.icon,
					main: elem.dataValues.path == req.session.home_path,
				})
			});

			console.log(funcItem);

			// get current profile
			var currentProfile = results[1]
			res.render("auth-page/" + req.path, {
				profile: currentProfile.dataValues,
				department: department,
				companyName: COMPANY_NAME,
				funcItem: funcItem
			})
		})
	})
}
