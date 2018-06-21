var sequelize = require('./../../sequelize');
var Sequelize = require('sequelize');
//Create Item Table Structure
var Department = sequelize.define('department', {
    department_id: { type: Sequelize.INTEGER(10), primaryKey: true, autoIncrement: true},
    name: Sequelize.STRING(200),
    path: Sequelize.STRING(50),
    icon: Sequelize.STRING(100),
    description: Sequelize.TEXT,
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
},{
    timestamps: false,
    freezeTableName: true,
});

// CREATE TABLE `department` (
//   `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
//   `name` varchar(200) NOT NULL,
//   `description` text NOT NULL,
//   `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//   PRIMARY KEY (`id`)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8;



// force: true will drop the table if it already exists
Department.sync({force: false}).then(() => {
});

module.exports = Department;
