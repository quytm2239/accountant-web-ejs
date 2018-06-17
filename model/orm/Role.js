var sequelize = require('./../../sequelize');
var Sequelize = require('sequelize');
//Create Item Table Structure
var Role = sequelize.define('role', {
    id: { type: Sequelize.INTEGER(10), primaryKey: true, autoIncrement: true},
    name: Sequelize.STRING(50),
    description: Sequelize.TEXT,
    department_id: Sequelize.INTEGER(10),
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
},{
    timestamps: false,
    freezeTableName: true,
});

// force: true will drop the table if it already exists
Role.sync({force: false}).then(() => {
});

module.exports = Role;
