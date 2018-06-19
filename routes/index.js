module.exports = function(app, config, M, sequelize, express) {
	var publicRouter = express.Router()
	require('./public')(app, publicRouter, config, M, sequelize)

  // Process to check session
	publicRouter.use(function(req, res, next) {
    console.log(req.session)
  	if (req.session.account_id) {
  		next()
  	} else {
  		res.redirect('/login')
  	}
	})
  // load route using middleware
	require('./auth')(app, publicRouter, config, M, sequelize)

	app.use('/', publicRouter)
}
