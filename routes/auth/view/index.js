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
		res.render("auth-page" + req.path, res.locals.commonData)
	})
}
