module.exports = function(sequelize, Account, Profile, utils, accountStatusEnum) {
  // Check email/username
  Account.findOne({
    where: {
      username: 'admin'
    }
  }).then(account => {
    if (account) {
      console.log('[CREATE ADMIN ACCOUNT] already done!');
    } else {
      var hashedPassword = utils.hashPass('123456');

      sequelize.transaction(function(t) {
        // chain all your queries here. make sure you return them.
        return Account.create({
          email: 'admin@admin.com',
          username: 'admin',
          password: hashedPassword,
          status: accountStatusEnum.NORMAL,
          role_id: 777
        }, {
          transaction: t
        }).then(function(account) {
          return Profile.create({
            account_id: account.dataValues.account_id,
            avatar: 'http://localhost:3000/avatar/hulkbuster2.0.jpg',
            full_name: 'admin',
            gender: 10,
            dob: '1970-01-01',
            phone: '0123456789',
            address: 'earth',
            department_id: 1000000,
            job_title: 'admin',
            join_date: '1970-01-01',
            contract_code: 'admin',
            staff_code: 'admin'
          }, {
            transaction: t
          });
        });
      }).then(function(result) {
        // Transaction has been committed
        // result is whatever the result of the promise chain returned to the transaction callback
        console.log('[CREATE ADMIN ACCOUNT] successfully!');
      }).catch(function(err) {
        // Transaction has been rolled back
        // err is whatever rejected the promise chain returned to the transaction callback
        console.log('[CREATE ADMIN ACCOUNT] fail!');
        console.log(err);
      });
    }
  });
};
