var sequelize = require('./../../sequelize');
var Sequelize = require('sequelize');
//Create Item Table Structure
var Permission = sequelize.define('permission', {
    permission_id: { type: Sequelize.INTEGER(10), primaryKey: true, autoIncrement: true},
    function_id: Sequelize.INTEGER(10),
    role_id: Sequelize.INTEGER(10),
    department_id: Sequelize.INTEGER(10),
    permission_config: Sequelize.INTEGER(4),
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
},{
    timestamps: false,
    freezeTableName: true,
});

// CREATE TABLE `permission` (
//   `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
//   `function_id` int(10) NOT NULL,
//   `role_id` int(10) unsigned NOT NULL,
//   `department_id` int(10) unsigned NOT NULL,
//   `permission` int(4) unsigned NOT NULL COMMENT '0 - Access denied\n1 - View only\n2 - View, Insert\n3 - View, Insert, Update\n4 - View, Insert, Update, Delete\n5 - Admin',
//   `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//   PRIMARY KEY (`id`)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

// force: true will drop the table if it already exists
Permission.sync({force: false}).then(() => {
});

module.exports = Permission;
