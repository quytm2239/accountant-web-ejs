module.exports = function(app,authRouter,config,M,sequelize){
    var errcode = app.get('errcode')
    var utils = app.get('utils')
    var permissionEnum = app.get('enums').PERMISSION

    authRouter.post('/permission', function(req, res) {

        var function_id = req.body.function_id
        var deparment_id = req.body.deparment_id
        var role_id 	 = req.body.role_id
        var permission_config = req.body.permission_config

        if (utils.isNullorUndefined(function_id) || isNaN(function_id))
        return res.status(400).send({
            success: false,
            message: 'function_id is not valid(number)!'
        })

        if (utils.isNullorUndefined(deparment_id) || isNaN(deparment_id))
        return res.status(400).send({
            success: false,
            message: 'deparment_id is not valid(number)!'
        })

        if (utils.isNullorUndefined(role_id) || isNaN(role_id))
        return res.status(400).send({
            success: false,
            message: 'role_id is not valid(number)!'
        })

        if (utils.isNullorUndefined(permission_config) || isNaN(permission_config) || permissionEnum.isValidPermission(permission_config))
        return res.status(400).send({
            success: false,
            message: 'permission_config is not valid(number, from 0 to 4)!'
        })
        M.Permission.findOne({ where:
            {
                function_id: function_id,
                deparment_id: deparment_id,
                role_id: role_id,
                permission_config: permission_config
            }
        }).then(permission => {
            if (permission) {
                res.status(400).send({
                    success: false,
                    message: 'permission already exist!'
                })
            } else {
                M.Permission.create({
                    function_id: function_id,
                    deparment_id: deparment_id,
                    role_id: role_id,
                    permission_config: permission_config
                }).then(function (permission) {
                    if (permission) {
                        res.status(200).send(
                            utils.response(
                                true
                                ,errcode.errorMessage(errcode.code_success)
                                ,permission ? permission : []
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
    authRouter.get('/permission-by-id', function(req, res) {

        var id = req.query.id
        if (utils.isNullorUndefined(id) || isNaN(id))
        return res.status(400).send({
            success: false,
            message: 'permission_id is not valid(number)!'
        })

        M.Permission.findOne({ where:
            {
                id: id
            }
        }).then(permission => {
            res.status(200).send(
                utils.response(
                    true
                    ,errcode.errorMessage(errcode.code_success)
                    ,permission ? permission : []
                )
            )
        })
    })
    authRouter.get('/permission-by-department', function(req, res) {

        var deparment_id = req.query.deparment_id

        if (utils.isNullorUndefined(deparment_id) || isNaN(deparment_id))
        return res.status(400).send({
            success: false,
            message: 'deparment_id is not valid(number)!'
        })

        M.Permission.findOne({ where:
            {
                deparment_id: deparment_id
            }
        }).then(permission => {
            res.status(200).send(
                utils.response(
                    true
                    ,errcode.errorMessage(errcode.code_success)
                    ,permission ? permission : []
                )
            )
        })
    })
    authRouter.get('/all-permission', function(req, res) {

        M.Permission.findAll().then(permissions => {
            res.status(200).send(
                utils.response(
                    true
                    ,errcode.errorMessage(errcode.code_success)
                    ,permissions ? permissions : []
                )
            )
        })
    })
    authRouter.put('/permission-by-id', function(req, res) {

        var role_id 	   = req.body.role_id
        var permission_config  = req.body.permission_config
        var id                  = req.body.id

        if (utils.isNullorUndefined(id) || isNaN(id))
        return res.status(400).send({
            success: false,
            message: 'id is not valid(number)!'
        })

        if (utils.isNullorUndefined(role_id) || isNaN(role_id))
        return res.status(400).send({
            success: false,
            message: 'role_id is not valid(number)!'
        })

        if (utils.isNullorUndefined(permission_config) || isNaN(permission_config) || permissionEnum.isValidPermission(permission_config))
        return res.status(400).send({
            success: false,
            message: 'permission_config is not valid(number, from 0 to 4)!'
        })

        M.Permission.findOne({ where:
            {
                id: id
            }
        }).then(permission => {
            if (permission) {
                if (permission.permission_config == permission_config && permission.role_id == role_id) {
                    // Dont need update
                    return res.status(200).send(
                        utils.response(
                            true
                            ,errcode.errorMessage(errcode.code_success)
                            ,permission ? [permission] : []
                        )
                    )
                }
                permission.update({
                  role_id: role_id,
                  permission_config: permission_config
                }).then(permission => {
                    return res.status(200).send(
                        utils.response(
                            true
                            ,errcode.errorMessage(errcode.code_success)
                            ,permission ? [permission] : []
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
                    message: 'This permission does not exist!'
                })
            }
        })
    })
    authRouter.delete('/permission-by-id', function(req, res) {

        var id 	 = req.body.id

        if (utils.isNullorUndefined(id) || isNaN(id))
        return res.status(400).send({
            success: false,
            message: 'id is not valid!'
        })

        M.Permission.findOne({ where:
            {
                id: id
            }
        }).then(permission => {
            if (permission) {
                permission.destroy()
                .then(() => {
                    return res.status(200).send(
                        utils.response(
                            true
                            ,errcode.errorMessage(errcode.code_success)
                            ,[]
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
                    message: 'This permission does not exist!'
                })
            }
        })
    })
}
