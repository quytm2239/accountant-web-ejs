module.exports = {
    PERMISSION : {
        ACCESS_DENIED               : 0,
        VIEW                        : 1,
        VIEW_INSERT                 : 2,
        VIEW_INSERT_UPDATE          : 3,
        VIEW_INSERT_UPDATE_DELETE   : 4,
        isValidPermission: function(enteredPermission) {
            if (isNaN(enteredPermission)) return false;
            switch (enteredPermission) {
                case module.exports.PERMISSION.ACCESS_DENIED:
                case module.exports.PERMISSION.VIEW:
                case module.exports.PERMISSION.VIEW_INSERT:
                case module.exports.PERMISSION.VIEW_INSERT_UPDATE:
                case module.exports.PERMISSION.VIEW_INSERT_UPDATE_DELETE:
                    return true;
                    break;
                default:
                return false;
            }
        }
    },
    ACCOUNT_STATUS: {
        NORMAL: 0,
        NEED_APPROVAL: 1,
        isValidAccountStatus: function(enteredAccountStatus) {
            if (isNaN(enteredAccountStatus)) return false;
            switch (enteredAccountStatus) {
                case module.exports.ACCOUNT_STATUS.NORMAL:
                case module.exports.ACCOUNT_STATUS.NEED_APPROVAL:
                    return true;
                    break;
                default:
                return false;
            }
        }
    },
    GENDER: {
        MALE: 0,
        FEMALE: 1,
        isValidGender: function(enteredGender) {
            if (isNaN(enteredGender)) return false;
            switch (enteredAccountStatus) {
                case module.exports.ACCOUNT_STATUS.NORMAL:
                case module.exports.ACCOUNT_STATUS.NEED_APPROVAL:
                    return true;
                    break;
                default:
                return false;
            }
        }
    }
};
