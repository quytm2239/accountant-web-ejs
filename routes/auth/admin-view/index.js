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

	authRouter.get('/member-approve', function(req, res) {
		var department = []

		sequelize.query('SELECT a.*, p.* FROM account a, profile p where a.status =:status and p.account_id = a.account_id',
		{
			replacements: {
				status: app.get('enums').ACCOUNT_STATUS.NEED_APPROVAL
			},
			model: M.Profile,
			type: sequelize.QueryTypes.SELECT
		})
		.then(profile => {
			console.log(profile);
		})

		res.render("admin-page" + req.path, res.locals.commonData)
	})
}
