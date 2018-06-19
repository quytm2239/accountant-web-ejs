module.exports = function(app, authRouter, config, M, sequelize) {
  require('./view')(app, authRouter, config, M, sequelize)

	// require('./api/account')(app, authRouter, config, M, sequelize)
	// require('./api/department')(app, authRouter, config, M, sequelize)
	// require('./api/role')(app, authRouter, config, M, sequelize)
	// require('./api/permission')(app, authRouter, config, M, sequelize)
}
