module.exports = function(app,authRouter,config,M,sequelize){
    var utils = app.get('utils')
    var errcode = app.get('errcode')

    authRouter.post('/deparment', function(req, res) {

        var name 	 = req.body.name
        var description = req.body.description

        if (utils.isNullorUndefined(name) || name.length == 0)
        return res.status(400).send({
            success: false,
            message: 'name is not valid!'
        })

        if (utils.isNullorUndefined(description) || description.length == 0)
        return res.status(400).send({
            success: false,
            message: 'description is not valid!'
        })

        // Check email/username
        M.Department.findOne({ where:
            {
                name: name
            }
        }).then(department => {
            if (department) {
                res.status(400).send({
                    success: false,
                    message: 'department already exist!'
                })
            } else {
                M.Department.create({
                    name: name,
                    description: description
                }).then(function (department) {
                    if (department) {
                        res.status(200).send(
                            utils.response(
                                true
                                ,errcode.errorMessage(errcode.code_success)
                                ,[department]
                            )
                        )
                    } else {
                        res.status(500).send({
                            success: false,
                            message: 'Internal error!'
                        })
                    }
                })
            }
        })
    })

    authRouter.get('/deparment-by-id', function(req, res) {

        var id 	 = req.query.id
        if (utils.isNullorUndefined(id) || isNaN(id))
        return res.status(400).send({
            success: false,
            message: 'id is not valid!'
        })

        M.Department.findOne({ where:
            {
                department_id: id
            }
        }).then(department => {
            res.status(200).send(
                utils.response(
                    true
                    ,errcode.errorMessage(errcode.code_success)
                    ,department ? department : []
                )
            )
        })
    })

    authRouter.get('/all-department', function(req, res) {

        M.Department.findAll().then(departments => {
            res.status(200).send({
                success: true,
                message: 'Successfully!',
                data: departments ? departments : []
            })
        })
    })
}
