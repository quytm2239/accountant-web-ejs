var sequelize = require('./../../sequelize');
var Sequelize = require('sequelize');
//Create Item Table Structure
var Account = sequelize.define('account', {
    id: { type: Sequelize.BIGINT(20), primaryKey: true, autoIncrement: true},
    username: Sequelize.STRING(45),
    password: Sequelize.STRING(500),
    email: Sequelize.STRING(100),
    status: Sequelize.INTEGER(2),
    role_id: Sequelize.INTEGER(2), //777 is ADMINISTRATOR - can add account or remove or update
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
},{
    timestamps: false,
    freezeTableName: true,
});

// CREATE TABLE `account` (
//   `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
//   `username` varchar(45) NOT NULL,
//   `password` text NOT NULL,
//   `email` text NOT NULL,
//   `status` int(2) unsigned NOT NULL DEFAULT '0',
//   `role` int(2) NOT NULL,
//   `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//   PRIMARY KEY (`id`)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

// force: true will drop the table if it already exists
Account.sync({force: false}).then(() => {
});

module.exports = Account;
