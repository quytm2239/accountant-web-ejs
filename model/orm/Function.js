var sequelize = require('./../../sequelize');
var Sequelize = require('sequelize');
//Create Item Table Structure
var Function = sequelize.define('function', {
    function_id: { type: Sequelize.INTEGER(10), primaryKey: true, autoIncrement: true},
    department_id: Sequelize.INTEGER(10),
    name: Sequelize.TEXT,
    path: Sequelize.STRING(50),
    description: Sequelize.TEXT,
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
},{
    timestamps: false,
    freezeTableName: true,
});

// CREATE TABLE `function` (
//   `id` int(10) unsigned zerofill NOT NULL,
//   `name` text NOT NULL,
//   `description` text,
//   `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//   PRIMARY KEY (`id`)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

// force: true will drop the table if it already exists
Function.sync({force: false}).then(() => {
});

module.exports = Function;
