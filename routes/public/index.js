module.exports = function(app,publicRouter,config,M,sequelize){
    require('./register')(app,publicRouter,config,M,sequelize);
    require('./login')(app,publicRouter,config,M,sequelize);
    require('./forgotpassword')(app,publicRouter,config,M,sequelize);
};
