module.exports = function(app, authRouter, config, M, sequelize) {

    require('./view')(app, authRouter, config, M, sequelize)

    var SUPER_ROLE = app.get('constants').SUPER_ROLE
    authRouter.use(function(req, res, next) {
        M.AdminList.findOne({
            where: { account_id: req.session.account_id }
        }).then(object => {
            if (req.session.role_id != SUPER_ROLE || object == null || object.length == 0) {
                return res.status(403).send({
                    success: false,
                    message: 'Your current logged-in account is not allowed to do this action!'
                })
            } else {
                next()
            }
        })
    })

    // require('./admin-view')(app, authRouter, config, M, sequelize)

	require('./api/account')(app, authRouter, config, M, sequelize)
	require('./api/department')(app, authRouter, config, M, sequelize)
	require('./api/role')(app, authRouter, config, M, sequelize)
	require('./api/permission')(app, authRouter, config, M, sequelize)
}
