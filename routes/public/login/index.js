module.exports = function(app, publicRouter, config, M, sequelize) {
  var errcode = app.get('errcode');
  var LOGIN_VIEW_PATH = 'page/login'
  var PLAIN_LAYOUT = 'plain-layout'
  var EMPTY = ''
  var ERROR_NOT_EXIST = 'Username or password does not exist!'
  var ERROR_NOT_APPROVED = 'Your account needs Admin approve to use!'

  publicRouter.get('/login', function(req, res, next) {
    if (req.session.account_id) {
      res.redirect('/home');
    } else {
      res.render(LOGIN_VIEW_PATH, {
        layout: PLAIN_LAYOUT,
        username: EMPTY,
        password: EMPTY,
        message: EMPTY
      });
    }
  });

  publicRouter.post('/logout', function(req, res) {
    if (req.session.account_id) {
      req.session.destroy(function(err) {
        res.status(200).send('/login');
      });
    } else {
      res.status(200).send('/login');
    }
  });

  publicRouter.post('/login', function(req, res) {
    var jwt = require('jsonwebtoken');
    var utils = app.get('utils');
    var accountStatusEnum = app.get('enums').ACCOUNT_STATUS;

    var username = req.body.username;
    var password = req.body.password;
    if (utils.isNullorUndefined(username) || utils.isNullorUndefined(password)) {
      return res.render(LOGIN_VIEW_PATH, {
        layout: PLAIN_LAYOUT,
        username: username,
        password: password,
        message: ERROR_NOT_EXIST
      });
    }
    M.Account.findOne({
      where: {
        username: username,
      }
    }).then(account => {
      if (account && utils.isExactPass(password, account.password)) {
        if (account.dataValues.status == accountStatusEnum.NEED_APPROVAL) {
          return res.render(LOGIN_VIEW_PATH, {
            layout: PLAIN_LAYOUT,
            username: username,
            password: password,
            message: ERROR_NOT_APPROVED
          });
        }
        // setup Session
        req.session.account_id = account.dataValues.id;
        req.session.username = account.dataValues.username;
        req.session.email = account.dataValues.email;
        req.session.hashedPassword = account.dataValues.password;
        req.session.role_id = account.dataValues.role_id;

        res.redirect('/home');
      } else {
        return res.render(LOGIN_VIEW_PATH, {
          layout: PLAIN_LAYOUT,
          username: username,
          password: password,
          message: 'Username or password does not exist!'
        });
      }
    });
  });
};
