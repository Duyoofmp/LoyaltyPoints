const admin = require('firebase-admin');
const ServiceAccount = require('./config/serviceAccount.json')

admin.initializeApp({
    credential: admin.credential.cert(ServiceAccount)
});

const Staffs = require('./api/Staffs')
exports.Staffs = Staffs.Staffs

const Users = require('./api/Users')
exports.Users = Users.Users

const StoreAdmins = require('./api/StoreAdmins')
exports.StoreAdmins = StoreAdmins.StoreAdmins