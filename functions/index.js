const admin = require('firebase-admin');
const ServiceAccount = require('./config/ServiceAccount.json')

admin.initializeApp({
    credential: admin.credential.cert(ServiceAccount)
});

const Staffs = require('./api/Staffs')
exports.Staffs = Staffs.Staffs

const Users = require('./api/Users')
exports.Users = Users.Users

const StoreAdmins = require('./api/StoreAdmins')
exports.StoreAdmins = StoreAdmins.StoreAdmins

const StaffsTriggers = require('./triggers/Staffs')
exports.OnStaffsCreate = StaffsTriggers.OnStaffsCreate
exports.OnStaffsUpdate = StaffsTriggers.OnStaffsUpdate

const StoreAdminsTriggers = require('./triggers/StoreAdmins')
exports.OnStoreAdminsCreate = StoreAdminsTriggers.OnStoreAdminsCreate
exports.OnStoreAdminsUpdate = StoreAdminsTriggers.OnStoreAdminsUpdate


const UsersTriggers = require('./triggers/Users')
exports.OnUsersCreate = UsersTriggers.OnUsersCreate
exports.OnUsersUpdate = UsersTriggers.OnUsersUpdate
exports.OnPointsUpdate = UsersTriggers.OnPointsUpdate