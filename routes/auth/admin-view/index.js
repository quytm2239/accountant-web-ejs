module.exports = function(app, authRouter, config, M, sequelize) {

	var SUPER_ROLE = app.get('constants').SUPER_ROLE
	var ADMIN_HOME_PATH = app.get('constants').ADMIN_HOME_PATH
	var ADMIN_HOME_PATH_NAME = app.get('constants').ADMIN_HOME_PATH_NAME
	var COMPANY_NAME = app.get('constants').COMPANY_NAME
	var ADMIN_PATH_ICON = app.get('constants').ADMIN_PATH_ICON

	const fs = require('fs')
	var utils = app.get('utils')
	var accountStatusEnum = app.get('enums').ACCOUNT_STATUS

	var MEMBER_ADD_VIEW_PATH = "admin-page" + '/member-add'
	var PLAIN_LAYOUT = 'plain-layout'
	var EMPTY = ''

	var http = require('http'),
		inspect = require('util').inspect
	var Busboy = require('busboy')

	var multer = require('multer')
	var upload = multer({storage: app.get('multer-storage')})
	var roles = []
	var departments = []

	authRouter.get('/news/member-approve', function(req, res) {
		var department = []

		sequelize.query('SELECT p.profile_id, p.avatar, p.full_name, a.username, a.email, r.name, p.gender, p.dob, p.phone, p.address, d.name, p.job_title, p.join_date, p.contract_code, p.staff_code FROM account a, profile p, role r, department d where d.department_id = p.department_id and p.account_id = a.account_id and r.role_id = a.role_id and a.status = :status',
		{
			replacements: {
				status: app.get('enums').ACCOUNT_STATUS.NEED_APPROVAL
			},
			// model: M.Profile,
			type: sequelize.QueryTypes.SELECT
		})
		.then(profile => {
			var pendingList = []
			profile.forEach(elem => { pendingList.push(elem.dataValues) })

			var basicData = res.locals.commonData
			let listHeader = []
			if (pendingList.length > 0) {
				listHeader = Object.keys(pendingList[0])
				console.log(listHeader);
			}
			basicData.pendingList = pendingList

			res.render("admin-page" + '/member-approve', basicData)
		})
	})

	authRouter.get('/news/member-add', function(req, res) {
		var department = []

		M.Role.findAll().then(list => {
			roles.push({display: 'Cấp bậc', value: '#'})
			list.forEach(function(item) {
				roles.push({display: item.dataValues.name, value: item.dataValues.role_id})
			})
		});

		M.Department.findAll().then(list => {
			departments.push({display: 'Phòng ban', value: '#'})
			list.forEach(function(item) {
				departments.push({display: item.dataValues.name, value: item.dataValues.department_id})
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

		res.render(MEMBER_ADD_VIEW_PATH, {
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

		res.render("admin-page" + '/member-add', res.locals.commonData)
	})

	authRouter.get('/news/member-remove', function(req, res) {
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
		res.render("admin-page" + '/member-remove', res.locals.commonData)
	})

	authRouter.get('/news/member-list', function(req, res) {
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
		res.render("admin-page" + '/member-list', res.locals.commonData)
	})
}
