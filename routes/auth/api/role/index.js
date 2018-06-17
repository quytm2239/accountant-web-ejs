module.exports = function(app,authRouter,config,M,sequelize){
    var errcode = app.get('errcode');
    var utils = app.get('utils');

    authRouter.post('/role', function(req, res) {

        var deparment_id = req.body.deparment_id;
        var name 	 = req.body.name;
        var description = req.body.description;

        if (utils.isNullorUndefined(deparment_id) || isNaN(deparment_id))
        return res.status(400).send({
            success: false,
            message: 'deparment_id is not valid, role can not go individualy!'
        });

        if (utils.isNullorUndefined(name) || name.length == 0)
        return res.status(400).send({
            success: false,
            message: 'name is not valid!'
        });

        if (utils.isNullorUndefined(description) || description.length == 0)
        return res.status(400).send({
            success: false,
            message: 'description is not valid!'
        });

        // Check email/username
        M.Role.findOne({ where:
            {
                name: name
            }
        }).then(role => {
            if (role) {
                res.status(400).send({
                    success: false,
                    message: 'role already exist!'
                });
            } else {
                M.Role.create({
                    deparment_id: deparment_id,
                    name: name,
                    description: description
                }).then(function (role) {
                    if (role) {
                        return res.status(200).send(
                            utils.response(
                                true
                                ,errcode.errorMessage(errcode.code_success)
                                ,[role]
                            )
                        );
                    } else {
                        res.status(500).send({
                            success: false,
                            message: 'Internal error!'
                        });
                    }
                });
            }
        });
    });
    authRouter.get('/role-by-id', function(req, res) {

        var id = req.query.id;
        if (utils.isNullorUndefined(id) || isNaN(id))
        return res.status(400).send({
            success: false,
            message: 'role_id is not valid(number)!'
        });

        M.Role.findOne({ where:
            {
                id: id
            }
        }).then(role => {
            return res.status(200).send(
                utils.response(
                    true
                    ,errcode.errorMessage(errcode.code_success)
                    ,role ? [role] : role
                )
            );
        });
    });
    authRouter.get('/role-by-department', function(req, res) {

        var deparment_id = req.query.deparment_id;

        if (utils.isNullorUndefined(deparment_id) || isNaN(deparment_id))
        return res.status(400).send({
            success: false,
            message: 'deparment_id is not valid(number)!'
        });

        M.Role.findOne({ where:
            {
                deparment_id: deparment_id
            }
        }).then(role => {
            return res.status(200).send(
                utils.response(
                    true
                    ,errcode.errorMessage(errcode.code_success)
                    ,role ? [role] : role
                )
            );
        });
    });
    authRouter.get('/all-role', function(req, res) {
        M.Role.findAll().then(roles => {
            return res.status(200).send(
                utils.response(
                    true
                    ,errcode.errorMessage(errcode.code_success)
                    ,roles ? roles : []
                )
            );
        });
    });
    authRouter.put('/role-by-id', function(req, res) {

        var name 	 = req.body.name;
        var description = req.body.description;
        var id = req.body.id;

        if (utils.isNullorUndefined(id) || isNaN(id))
        return res.status(400).send({
            success: false,
            message: 'id is not valid(number)!'
        });

        if (utils.isNullorUndefined(name) || name.length == 0)
        return res.status(400).send({
            success: false,
            message: 'name is not valid!'
        });

        if (utils.isNullorUndefined(description) || description.length == 0)
        return res.status(400).send({
            success: false,
            message: 'description is not valid!'
        });

        M.Role.findOne({ where:
            {
                id: id
            }
        }).then(role => {
            if (role) {
                role.update({
                  name: name,
                  description: description
                }).then(role => {
                    return res.status(200).send(
                        utils.response(
                            true
                            ,errcode.errorMessage(errcode.code_success)
                            ,role ? [role] : []
                        )
                    );
                }).error(() => {
                    return res.status(500).send({
                        success: false,
                        message: 'Internal error!'
                    });
                });
            } else {
                return res.status(400).send({
                    success: false,
                    message: 'This role does not exist!'
                });
            }
        });
    });
    authRouter.delete('/role-by-name', function(req, res) {

        var name 	 = req.body.name;

        if (utils.isNullorUndefined(name) || name.length == 0)
        return res.status(400).send({
            success: false,
            message: 'name is not valid!'
        });

        M.Role.findOne({ where:
            {
                name: name
            }
        }).then(role => {
            if (role) {
                role.destroy()
                .then(() => {
                    return res.status(200).send(
                        utils.response(
                            true
                            ,errcode.errorMessage(errcode.code_success)
                            ,[]
                        )
                    );
                }).error(() => {
                    return res.status(500).send({
                        success: false,
                        message: 'Internal error!'
                    });
                });
            } else {
                return res.status(400).send({
                    success: false,
                    message: 'This role does not exist!'
                });
            }
        });
    });
    authRouter.delete('/role-by-id', function(req, res) {

        var id 	 = req.body.id;

        if (utils.isNullorUndefined(id) || isNaN(id))
        return res.status(400).send({
            success: false,
            message: 'id is not valid!'
        });

        M.Role.findOne({ where:
            {
                id: id
            }
        }).then(role => {
            if (role) {
                role.destroy()
                .then(() => {
                    return res.status(200).send(
                        utils.response(
                            true
                            ,errcode.errorMessage(errcode.code_success)
                            ,[]
                        )
                    );
                }).error(() => {
                    return res.status(500).send({
                        success: false,
                        message: 'Internal error!'
                    });
                });
            } else {
                return res.status(400).send({
                    success: false,
                    message: 'This role does not exist!'
                });
            }
        });
    });
};
