var sequelize = require('./../../sequelize');
var Sequelize = require('sequelize');
//Create Item Table Structure
var Profile = sequelize.define('profile', {
    id: { type: Sequelize.BIGINT(20), primaryKey: true, autoIncrement: true},
    account_id: Sequelize.BIGINT(20),
    avatar: Sequelize.STRING(400),
    full_name: Sequelize.TEXT,
    gender: Sequelize.INTEGER(2),
    dob: Sequelize.STRING(50),
    phone: Sequelize.STRING(20),
    address: Sequelize.TEXT,
    department_id: Sequelize.INTEGER(10),
    job_title: Sequelize.STRING(100),
    join_date: Sequelize.STRING(50),
    contract_code: Sequelize.STRING(20),
    staff_code: Sequelize.STRING(20),
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
},{
    timestamps: false,
    freezeTableName: true,
});

// CREATE TABLE profile (
//   id int(11) unsigned NOT NULL AUTO_INCREMENT,
//   account_id int(11) unsigned NOT NULL COMMENT 'refer to account.id',
//   full_name text CHARACTER SET latin1 NOT NULL,
//   gender int(1) unsigned NOT NULL,
//   dob varchar(50) CHARACTER SET latin1 NOT NULL,
//   phone varchar(20) NOT NULL,
//   address text NOT NULL,
//   department_id int(11) unsigned NOT NULL,
//   job_title varchar(100) NOT NULL,
//   join_date varchar(50) NOT NULL,
//   contract_code varchar(20) NOT NULL,
//   staff_code varchar(20) NOT NULL,
//   createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//   PRIMARY KEY (id)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8;


// force: true will drop the table if it already exists
Profile.sync({force: false}).then(() => {
});

module.exports = Profile;
