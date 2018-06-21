module.exports = function(app, publicRouter, config, M, sequelize) {
    var errcode = app.get('errcode')
    var LOGIN_VIEW_PATH = 'page/login'
    var PLAIN_LAYOUT = 'plain-layout'
    var EMPTY = ''
    var ERROR_NOT_EXIST = 'Username or password does not exist!'
    var ERROR_NOT_APPROVED = 'Your account needs Admin approve to use!'

    publicRouter.get('/login', function(req, res, next) {
        if (req.session.account_id) {
            res.redirect(req.session.home_path)
        } else {
            res.render(LOGIN_VIEW_PATH, {
                layout: PLAIN_LAYOUT,
                username: EMPTY,
                password: EMPTY,
                message: EMPTY
            })
        }
    })

    publicRouter.post('/logout', function(req, res) {
        if (req.session.account_id) {
            req.session.destroy(function(err) {
                res.status(200).send('/login')
            })
        } else {
            res.status(200).send('/login')
        }
    })

    publicRouter.post('/login', function(req, res) {
        var jwt = require('jsonwebtoken')
        var utils = app.get('utils')
        var accountStatusEnum = app.get('enums').ACCOUNT_STATUS
        var SUPER_ROLE = app.get('constants').SUPER_ROLE
        var ADMIN_HOME_PATH = app.get('constants').ADMIN_HOME_PATH
        
        var username = req.body.username
        var password = req.body.password
        if (utils.isNullorUndefined(username) || utils.isNullorUndefined(password)) {
            return res.render(LOGIN_VIEW_PATH, {
                layout: PLAIN_LAYOUT,
                username: username,
                password: password,
                message: ERROR_NOT_EXIST
            })
        }
        M.Account.findOne({
            where: {
                username: username
            }
        }).then(account => {
            if (account && utils.isExactPass(password, account.password)) {
                if (account.dataValues.status == accountStatusEnum.NEED_APPROVAL) {
                    return res.render(LOGIN_VIEW_PATH, {
                        layout: PLAIN_LAYOUT,
                        username: username,
                        password: password,
                        message: ERROR_NOT_APPROVED
                    })
                }
                Promise.all([
                    M.Profile.findOne({ where: { account_id: account.account_id } }),
                    M.AdminList.findOne({ where: { account_id: account.account_id } })
                ]).then(results => {

                    // setup Session
                    req.session.account_id = account.dataValues.account_id
                    req.session.username = account.dataValues.username
                    req.session.email = account.dataValues.email
                    req.session.role_id = account.dataValues.role_id

                    req.session.profile_id = results[0].dataValues.id
                    req.session.department_id = results[0].dataValues.department_id

                    // check for home page
                    M.Department.findOne({ where: { department_id: results[0].dataValues.department_id } }).then(department => {
                        if (account.dataValues.role_id == SUPER_ROLE || results[1]) {
                            req.session.home_path = ADMIN_HOME_PATH
                        } else {
                            req.session.home_path = department.path
                        }
                        console.log('LOGIN SUCCESSFULLY! REDIRECT TO: ' + req.session.home_path);
                        res.redirect(req.session.home_path)
                    });
                })
            } else {
                return res.render(LOGIN_VIEW_PATH, {
                    layout: PLAIN_LAYOUT,
                    username: username,
                    password: password,
                    message: 'Username or password does not exist!'
                })
            }
        })
    })
}
