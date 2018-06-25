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

    // get common data
    authRouter.use(function(req, res, next){
        console.log(req.path);
        var department = []
        var nomralQuery = 'select f.* from function f, department d where d.path like :path and d.department_id = f.department_id'
        var adminQuery = 'select * from function where department_id = ' + SUPER_ROLE
        var executedQuery = req.path == ADMIN_HOME_PATH ? adminQuery : nomralQuery
		Promise.all([
			M.Department.findAll(),
			M.Profile.findOne({ where: { account_id: req.session.account_id } }),
            sequelize.query(executedQuery, {
                model: M.Function,
                type: sequelize.QueryTypes.SELECT,
                replacements: {
                    path: req.path
                }
            })
		]).then(results => {
			var funcItem = []
            if (results[2]) {
                results[2].forEach(elem => {
                    funcItem.push(elem.dataValues)
                })
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

			// get current profile
			var currentProfile = results[1]

            res.locals.commonData = {
				profile: currentProfile.dataValues,
				department: department,
				companyName: COMPANY_NAME,
				funcItem: funcItem
			}

            next()
		})
    })

    require('./view')(app, authRouter, config, M, sequelize)

    var SUPER_ROLE = app.get('constants').SUPER_ROLE
    authRouter.use(function(req, res, next) {
        M.AdminList.findOne({
            where: { account_id: req.session.account_id }
        }).then(object => {
            if (req.session.role_id != SUPER_ROLE && object == null) {
                return res.status(403).send({
                    success: false,
                    message: 'Your current logged-in account is not allowed to do this action!'
                })
            } else {
                next()
            }
        })
    })

    require('./admin-view')(app, authRouter, config, M, sequelize)

	require('./api/account')(app, authRouter, config, M, sequelize)
	require('./api/department')(app, authRouter, config, M, sequelize)
	require('./api/role')(app, authRouter, config, M, sequelize)
	require('./api/permission')(app, authRouter, config, M, sequelize)
}
