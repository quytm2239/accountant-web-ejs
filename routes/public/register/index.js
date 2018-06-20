module.exports = function(app, publicRouter, config, M, sequelize) {

	const fs = require('fs')
    var utils = app.get('utils')
    var accountStatusEnum = app.get('enums').ACCOUNT_STATUS

    var REGISTER_REGISTER_VIEW_PATH = 'page/register'
	var PLAIN_LAYOUT = 'plain-layout'
	var EMPTY = ''

    var http = require('http'),
        inspect = require('util').inspect
    var Busboy = require('busboy')

    var multer = require('multer')
    var upload = multer({storage: app.get('multer-storage')})
    var roles = []
    var departments = []

    M.Role.findAll().then(list => {
        roles.push({display: 'Cấp bậc', value: '#'})
        list.forEach(function(item) {
            roles.push({display: item.dataValues.name, value: item.dataValues.id})
        })
    });

    M.Department.findAll().then(list => {
        departments.push({display: 'Phòng ban', value: '#'})
        list.forEach(function(item) {
            departments.push({display: item.dataValues.name, value: item.dataValues.id})
        })
    });

    var genders = [
        {
            display: 'Giới tính',
            value: '#'
        }, {
            display: 'Nam',
            value: app.get('enums').GENDER.MALE
        }, {
            display: 'Nữ',
            value: app.get('enums').GENDER.FEMALE
        }
    ]

    publicRouter.get('/register', function(req, res, next) {

        res.render(REGISTER_REGISTER_VIEW_PATH, {
            layout: PLAIN_LAYOUT,
            inputs: [
                [
                    {
                        type: 'text',
                        name: 'full_name',
                        placeholder: 'Full name'
                    }, {
                        type: 'select',
                        name: 'gender',
                        placeholder: 'Gender',
                        options: genders
                    }
                ],
                // same line
                [
                    {
                        type: 'text',
                        name: 'email',
                        placeholder: 'Email'
                    }, {
                        type: 'text',
                        name: 'username',
                        placeholder: 'Username'
                    }
                ],
                // same line
                [
                    {
                        type: 'password',
                        name: 'password',
                        placeholder: 'Password'
                    }, {
                        type: 'password',
                        name: 'retype_password',
                        placeholder: 'Confirm password'
                    }
                ],
                [

                    {
                        type: 'date',
                        name: 'dob',
                        placeholder: 'Date of birth'
                    }, {
                        type: 'text',
                        name: 'phone',
                        placeholder: 'Phone',
                        pattern: '[0-9]{10}'
                    }
                ], {
                    type: 'text',
                    name: 'address',
                    placeholder: 'Address'
                },
                [
                    {
                        type: 'select',
                        name: 'role_id',
                        placeholder: 'Role',
                        options: roles
                    }, {
                        type: 'select',
                        name: 'department_id',
                        placeholder: 'Department',
                        options: departments
                    }
                ],
                [
                    {
                        type: 'text',
                        name: 'job_title',
                        placeholder: 'Job title'
                    }, {
                        type: 'date',
                        name: 'join_date',
                        placeholder: 'Join date'
                    }
                ],
                [
                    {
                        type: 'text',
                        name: 'contract_code',
                        placeholder: 'Contract code'
                    }, {
                        type: 'text',
                        name: 'staff_code',
                        placeholder: 'Staff code'
                    }
                ], {
                    type: 'file',
                    name: 'avatar',
                    placeholder: 'Avatar'
                }
            ]
        })
    })

    // publicRouter.post('/register', function(req, res) {
    //     var busboy = new Busboy({ headers: req.headers })
    //     busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    //         console.log('File [' + fieldname + ']: filename: ' + filename)
    //         file.on('data', function(data) {
    //             console.log('File [' + fieldname + '] got ' + data.length + ' bytes')
    //         })
    //         file.on('end', function() {
    //             console.log('File [' + fieldname + '] Finished')
    //         })
    //     })
    //     busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
    //         console.log('Field [' + fieldname + ']: value: ' + inspect(val))
    //     })
    //     busboy.on('finish', function() {
    //         console.log('Done parsing form!')
    //         res.writeHead(303, { Connection: 'close', Location: '/' })
    //         res.end()
    //     })
    //     req.pipe(busboy)
    // })

    app.post('/register', upload.single('avatar'), function(req, res, next) {
        var file = req.file
        console.log(file);
        var email = req.body.email
        var username = req.body.username
        var password = req.body.password
        var role_id = req.body.role_id

        var full_name = req.body.full_name
        var gender = req.body.gender
        var dob = req.body.dob
        var phone = req.body.phone
        var address = req.body.address
        var department_id = req.body.department_id
        var job_title = req.body.job_title
        var join_date = req.body.join_date
        var contract_code = req.body.contract_code
        var staff_code = req.body.staff_code

        if (utils.isNullorUndefined(email) || !utils.validateEmail(email)) {
            fs.unlink(file.path, (err) => {
                if (err) {
                    console.log("failed to delete local image:" + err);
                } else {
                    console.log('successfully deleted local image');
                }
            });
            return res.status(200).send({success: false, message: 'email is not valid!'})
        }

        if (utils.isNullorUndefined(username) || username.length == 0) {
            fs.unlink(file.path, (err) => {
                if (err) {
                    console.log("failed to delete local image:" + err);
                } else {
                    console.log('successfully deleted local image');
                }
            });
            return res.status(200).send({success: false, message: 'username is not valid!'})
        }

        if (utils.isNullorUndefined(password) || password.length == 0) {
            fs.unlink(file.path, (err) => {
                if (err) {
                    console.log("failed to delete local image:" + err);
                } else {
                    console.log('successfully deleted local image');
                }
            });
            return res.status(200).send({success: false, message: 'password is not valid!'})
        }

        if (utils.isNullorUndefined(role_id) || isNaN(role_id)) {
            fs.unlink(file.path, (err) => {
                if (err) {
                    console.log("failed to delete local image:" + err);
                } else {
                    console.log('successfully deleted local image');
                }
            });
            return res.status(200).send({success: false, message: 'role_id is not valid(number)!'})
        }

        // check profile's parameter
        if (utils.isNullorUndefined(full_name) || full_name.length == 0) {
            fs.unlink(file.path, (err) => {
                if (err) {
                    console.log("failed to delete local image:" + err);
                } else {
                    console.log('successfully deleted local image');
                }
            });
            return res.status(200).send({success: false, message: 'full_name is not valid!'})
        }

        if (utils.isNullorUndefined(gender) || isNaN(gender)) {
            fs.unlink(file.path, (err) => {
                if (err) {
                    console.log("failed to delete local image:" + err);
                } else {
                    console.log('successfully deleted local image');
                }
            });
            return res.status(200).send({success: false, message: 'gender is not valid(number)!'})
        }
        if (utils.isNullorUndefined(dob) || dob.length == 0 || !utils.validateBirthday(dob)) {
            fs.unlink(file.path, (err) => {
                if (err) {
                    console.log("failed to delete local image:" + err);
                } else {
                    console.log('successfully deleted local image');
                }
            });
            return res.status(200).send({success: false, message: 'birthday is not valid!'})
        }
        if (utils.isNullorUndefined(phone) || phone.length == 0 || !utils.validatePhone(phone)) {
            fs.unlink(file.path, (err) => {
                if (err) {
                    console.log("failed to delete local image:" + err);
                } else {
                    console.log('successfully deleted local image');
                }
            });
            return res.status(200).send({success: false, message: 'phone is not valid!'})
        }
        if (utils.isNullorUndefined(address) || address.length == 0) {
            fs.unlink(file.path, (err) => {
                if (err) {
                    console.log("failed to delete local image:" + err);
                } else {
                    console.log('successfully deleted local image');
                }
            });
            return res.status(200).send({success: false, message: 'address is not valid!'})
        }

        if (utils.isNullorUndefined(job_title) || job_title.length == 0) {
            fs.unlink(file.path, (err) => {
                if (err) {
                    console.log("failed to delete local image:" + err);
                } else {
                    console.log('successfully deleted local image');
                }
            });
            return res.status(200).send({success: false, message: 'job_title is not valid!'})
        }

        if (utils.isNullorUndefined(join_date) || join_date.length == 0 || !utils.validateBirthday(join_date)) {
            fs.unlink(file.path, (err) => {
                if (err) {
                    console.log("failed to delete local image:" + err);
                } else {
                    console.log('successfully deleted local image');
                }
            });
            return res.status(200).send({success: false, message: 'join_date is not valid!'})
        }

        if (utils.isNullorUndefined(contract_code) || contract_code.length == 0) {
            fs.unlink(file.path, (err) => {
                if (err) {
                    console.log("failed to delete local image:" + err);
                } else {
                    console.log('successfully deleted local image');
                }
            });
            return res.status(200).send({success: false, message: 'contract_code is not valid!'})
        }

        if (utils.isNullorUndefined(staff_code) || staff_code.length == 0) {
            fs.unlink(file.path, (err) => {
                if (err) {
                    console.log("failed to delete local image:" + err);
                } else {
                    console.log('successfully deleted local image');
                }
            });
            return res.status(200).send({success: false, message: 'staff_code is not valid!'})
        }

        // Check email/username
        M.Account.findOne({
            where: {
                $or: [
                    {
                        username: username
                    }, {
                        email: email
                    }
                ]
            }
        }).then(account => {
            if (account) {
				fs.unlink(file.path, (err) => {
					if (err) {
						console.log("failed to delete local image:" + err);
					} else {
						console.log('successfully deleted local image');
					}
				});
                res.status(200).send({success: false, message: 'username or email already exist!'})
            } else {
                // Check full_name
                M.Profile.findOne({
                    where: {
                        $or: [
                            {
                                full_name: full_name
                            }, {
                                phone: phone
                            }
                        ]
                    }
                }).then(profile => {
                    if (profile) {
						fs.unlink(file.path, (err) => {
							if (err) {
								console.log("failed to delete local image:" + err);
							} else {
								console.log('successfully deleted local image');
							}
						});
                        res.status(200).send({success: false, message: 'full_name or phone already exist!'})
                    } else {
                        var hashedPassword = utils.hashPass(password)

                        sequelize.transaction(function(t) {
                            // chain all your queries here. make sure you return them.
                            return M.Account.create({
                                email: email,
                                username: username,
                                password: hashedPassword,
                                status: accountStatusEnum.NEED_APPROVAL,
                                role_id: role_id
                            }, {transaction: t}).then(function(account) {
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
                                }, {transaction: t}).catch(function(err) {
                                    // Transaction has been rolled back
                                    // err is whatever rejected the promise chain returned to the transaction callback
                                    console.log(err);
                                })
                            })
                        }).then(function(result) {
                            // Transaction has been committed
                            // result is whatever the result of the promise chain returned to the transaction callback
                            return res.status(200).send({success: true, message: 'Register successfully!'})
                        }).catch(function(err) {
                            // Transaction has been rolled back
                            // err is whatever rejected the promise chain returned to the transaction callback
							fs.unlink(file.path, (err) => {
								if (err) {
									console.log("failed to delete local image:" + err);
								} else {
									console.log('successfully deleted local image');
								}
							});
                            res.status(200).send({success: false, message: err})
                        })
                    }
                })
            }
        })
    })
}
