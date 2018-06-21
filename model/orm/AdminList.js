var sequelize = require('./../../sequelize');
var Sequelize = require('sequelize');
//Create Item Table Structure
var AdminList = sequelize.define('admin_list', {
    admin_list_id: { type: Sequelize.INTEGER(10), primaryKey: true, autoIncrement: true},
    account_id: Sequelize.INTEGER(10),
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
},{
    timestamps: false,
    freezeTableName: true,
});

// CREATE TABLE `admin_list` (
//   `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
//   `account_id` int(10) unsigned NOT NULL,
//   `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//   PRIMARY KEY (`id`)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8;


// force: true will drop the table if it already exists
AdminList.sync({force: false}).then(() => {
});

module.exports = AdminList;
