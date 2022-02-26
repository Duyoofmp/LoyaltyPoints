const admin = require('firebase-admin');
const ServiceAccount = require('./config/ServiceAccount.json')

admin.initializeApp({
    credential: admin.credential.cert(ServiceAccount)
});


const Loyalty = require('./api/LoyaltyAdmin')
exports.Loyalty = Loyalty.Loyalty

const Staffs = require('./api/Staffs')
exports.Staffs = Staffs.Staffs

const Users = require('./api/Users')
exports.Users = Users.Users

const StoreAdmins = require('./api/StoreAdmins')
exports.StoreAdmins = StoreAdmins.StoreAdmins

const LoginForStoreAdmin = require('./api/StoreAdmins')
exports.LoginForStoreAdmin = LoginForStoreAdmin.LoginForStoreAdmin

const LoginForStaff = require('./api/Staffs')
exports.LoginForStaff = LoginForStaff.LoginForStaff


const Category = require('./api/Category')
exports.Category = Category.Category

const Home = require('./api/UserApis/Home')
exports.Home = Home.Home

const UserStoreAdmin = require('./api/UserApis/StoreAdmin')
exports.UserStoreAdmin = UserStoreAdmin.StoreAdminUser

const Banners = require('./api/Banners')
exports.Banners = Banners.Banners

const SuperAdmin = require('./api/SuperAdmin')
exports.SuperAdmin = SuperAdmin.SuperAdmin

const LoginForSuperAdmin = require('./api/SuperAdmin')
exports.LoginForSuperAdmin = LoginForSuperAdmin.LoginForStoreAdmin

const StaffsTriggers = require('./triggers/Staffs')
exports.OnStaffsCreate = StaffsTriggers.OnStaffsCreate
exports.OnStaffsUpdate = StaffsTriggers.OnStaffsUpdate

const StoreAdminsTriggers = require('./triggers/StoreAdmins')
exports.OnStoreAdminsCreate = StoreAdminsTriggers.OnStoreAdminsCreate
exports.OnStoreAdminsUpdate = StoreAdminsTriggers.OnStoreAdminsUpdate
exports.scheduledFunctionForExpiry = StoreAdminsTriggers.scheduledFunctionForExpiry




const UsersTriggers = require('./triggers/Users')
exports.OnUsersCreate = UsersTriggers.OnUsersCreate
exports.OnUsersUpdate = UsersTriggers.OnUsersUpdate
exports.OnPointsUpdate = UsersTriggers.OnPointsUpdate