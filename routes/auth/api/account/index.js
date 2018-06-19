module.exports = function(app,authRouter,config,M,sequelize){

    var utils = app.get('utils')
    var errcode = app.get('errcode')
    var accountStatusEnum = app.get('enums').ACCOUNT_STATUS

    var SUPER_ROLE = app.get('constants').SUPER_ROLE
  	var checkRole = function(req, res) {
  		if (req.session.account.role_id != SUPER_ROLE) {
  			return res.status(403).send({
  				success: false,
  				message: 'Your current logged-in account is not allowed to do this action!'
  			})
  		}
  	}

    authRouter.post('/add-member', function(req, res) {
        checkRole(req, res)

        var email 	 = req.body.email
        var username = req.body.username
        var password = req.body.password
        var role_id = req.body.role_id

        var full_name = req.body.full_name
        var gender 	 = req.body.gender
        var dob = req.body.dob
        var phone = req.body.phone
        var address = req.body.address
        var department_id = req.body.department_id
        var job_title = req.body.job_title
        var join_date = req.body.join_date
        var contract_code = req.body.contract_code
        var staff_code = req.body.staff_code

        if (utils.isNullorUndefined(email) || !utils.validateEmail(email))
        return res.status(400).send({
            success: false,
            message: 'email is not valid!'
        })

        if (utils.isNullorUndefined(username) || username.length == 0)
        return res.status(400).send({
            success: false,
            message: 'username is not valid!'
        })

        if (utils.isNullorUndefined(password) || password.length == 0)
        return res.status(400).send({
            success: false,
            message: 'password is not valid!'
        })

        if (utils.isNullorUndefined(role_id) || isNaN(role_id))
        return res.status(400).send({
            success: false,
            message: 'role_id is not valid(number)!'
        })

        // check profile's parameter
        if (utils.isNullorUndefined(full_name) || full_name.length == 0)
        return res.status(400).send({
            success: false,
            message: 'full_name is not valid!'
        })

        if (utils.isNullorUndefined(gender) || isNaN(gender))
        return res.status(400).send({
            success: false,
            message: 'gender is not valid(number)!'
        })

        if (utils.isNullorUndefined(dob) || dob.length == 0 || !utils.validateBirthday(dob))
        return res.status(400).send({
            success: false,
            message: 'birthday is not valid!'
        })

        if (utils.isNullorUndefined(phone) || phone.length == 0 || !utils.validatePhone(phone))
        return res.status(400).send({
            success: false,
            message: 'phone is not valid!'
        })

        if (utils.isNullorUndefined(address) || address.length == 0)
        return res.status(400).send({
            success: false,
            message: 'address is not valid!'
        })

        if (utils.isNullorUndefined(job_title) || job_title.length == 0)
        return res.status(400).send({
            success: false,
            message: 'job_title is not valid!'
        })

        if (utils.isNullorUndefined(join_date) || join_date.length == 0 || !utils.validateBirthday(join_date))
        return res.status(400).send({
            success: false,
            message: 'join_date is not valid!'
        })

        if (utils.isNullorUndefined(contract_code) || contract_code.length == 0)
        return res.status(400).send({
            success: false,
            message: 'contract_code is not valid!'
        })

        if (utils.isNullorUndefined(staff_code) || staff_code.length == 0)
        return res.status(400).send({
            success: false,
            message: 'staff_code is not valid!'
        })

        // Check email/username
        M.Account.findOne({ where:
            {
                $or: [
                    { username: username },
                    { email: email }
                ]
            }
        }).then(account => {
            if (account) {
                res.status(400).send({
                    success: false,
                    message: 'username or email already exist!'
                })
            } else {
                // Check full_name
                M.Profile.findOne({ where:
                    {
                        $or: [
                            { full_name: full_name },
                            { phone: phone }
                        ]
                    }
                }).then(profile => {
                    if (profile) {
                        res.status(400).send({
                            success: false,
                            message: 'full_name or phone already exist!'
                        })
                    } else {
                        var hashedPassword = utils.hashPass(password)

                        sequelize.transaction(function (t) {
                            // chain all your queries here. make sure you return them.
                            return M.Account.create({
                                email: email,
                                username: username,
                                password: hashedPassword,
                                status: accountStatusEnum.NORMAL,
                                role_id: role_id
                            }, {transaction: t}).then(function (account) {
                                return M.Profile.create({
                                    account_id: account.dataValues.id,
                                    full_name: full_name,
                                    gender: parseInt(gender),
                                    dob: dob,
                                    phone: phone,
                                    address: address,
                                    department_id: department_id,
                                    job_title: job_title,
                                    join_date: join_date,
                                    contract_code: contract_code,
                                    staff_code: staff_code
                                }, {transaction: t})
                            })
                        }).then(function (result) {
                        // Transaction has been committed
                        // result is whatever the result of the promise chain returned to the transaction callback
                            res.status(200).send(
                                utils.response(
                                    true
                                    ,errcode.errorMessage(errcode.code_success)
                                    ,[]
                                )
                            )
                        }).catch(function (err) {
                        // Transaction has been rolled back
                        // err is whatever rejected the promise chain returned to the transaction callback
                            res.status(500).send({
                                success: false,
                                message: 'Something went wrong, please try again!'
                            })
                        })
                    }
                })
            }
        })

        // ORM.Account.create({ username: username, password: hashedPassword }).then(savedAccount => {
        //   // you can now access the newly created task via the variable task
        //   res.status(200).send({message:savedAccount})
        //  	})

        // ORM.Account.bulkCreate([
        //   { username: username, password: hashedPassword }
        // ]).then(() => { // Notice: There are no arguments here, as of right now you'll have to...
        //   return ORM.Account.findAll()
        //  	}).then(account => {
        //   console.log(account) // ... in order to get the array of user objects
        //   res.redirect('/login')
        // })
    })
    authRouter.get('/pending-account', function(req, res) {
        M.Account.findAll({
            where : {
                status: accountStatusEnum.NEED_APPROVAL
            }
        }).then(accounts => {
            res.status(200).send(
                utils.response(
                    true
                    ,errcode.errorMessage(errcode.code_success)
                    ,accounts ? accounts : []
                )
            )
        })
    })
    authRouter.post('/approve-account', function(req, res) {

        var id = req.body.id

        if (utils.isNullorUndefined(id) || isNaN(id))
        return res.status(400).send({
            success: false,
            message: 'id is not valid(number)!'
        })

        M.Acount.findOne({ where:
            {
                id: id
            }
        }).then(account => {
            if (account) {
                account.update({
                  status: accountStatusEnum.NORMAL,
                }).then(account => {
                    return res.status(200).send(
                        utils.response(
                            true
                            ,errcode.errorMessage(errcode.code_success)
                            ,account ? [account] : []
                        )
                    )
                }).error(() => {
                    return res.status(500).send({
                        success: false,
                        message: 'Internal error!'
                    })
                })
            } else {
                return res.status(400).send({
                    success: false,
                    message: 'This account does not exist!'
                })
            }
        })
    })
    authRouter.delete('/account-by-id', function(req, res) {

        var id 	 = req.body.id

        if (utils.isNullorUndefined(id) || isNaN(id))
        return res.status(400).send({
            success: false,
            message: 'id is not valid!'
        })

        M.Account.findOne({ where:
            {
                id: id
            }
        }).then(account => {
            if (account) {
                sequelize.transaction(function (t) {
                    // chain all your queries here. make sure you return them.
                    return M.Account.destroy({
                        where: { id: id }
                    }, {transaction: t}
                    ).then(function (result) {
                        return M.Profile.destroy({
                            where: { account_id: id }
                        }, {transaction: t})
                    }).catch(function (err) {
                        res.status(500).send({
                            success: false,
                            message: err
                        })
                    })
                }).then(function (result) {
                // Transaction has been committed
                // result is whatever the result of the promise chain returned to the transaction callback
                    console.log(result)
                    res.status(200).send({
                        success: true,
                        message: 'Successfully!'
                    })
                }).catch(function (err) {
                // Transaction has been rolled back
                // err is whatever rejected the promise chain returned to the transaction callback
                    res.status(500).send({
                        success: false,
                        message: err
                    })
                })
            } else {
                res.status(400).send({
                    success: false,
                    message: 'This account does not exist!'
                })
            }
        })
    })
}
