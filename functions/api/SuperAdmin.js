const functions = require('firebase-functions');
const admin = require('firebase-admin');

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));

const common = require("../common");
app.use(common.decodeIDToken)


const BannerFunctions = require('../services/Banners');

const SuperAdminFunctions = require('../services/SuperAdmin')

app.post('/CreateBanner', async (req, res) => {
    req.body.SuperAdmin = true;
    BannerFunctions.Create(req, res)
})

app.post('/ReadBanner', async (req, res) => BannerFunctions.Read(req, res))

app.post('/UpdateBanner', async (req, res) => BannerFunctions.Update(req, res))

app.post('/DeleteBanner', async (req, res) => BannerFunctions.Delete(req, res))

const StoreAdminsFunctions = require('../services/StoreAdmins')

app.post('/ReadStoreAdmins', async (req, res) => StoreAdminsFunctions.Read(req, res))

app.post('/UpdateStoreAdmins', async (req, res) => StoreAdminsFunctions.Update(req, res))

app.post('/DeleteStoreAdmins', async (req, res) => StoreAdminsFunctions.Delete(req, res))

exports.SuperAdmin = functions.region("asia-south1").https.onRequest(app)

const app3 = express();
app3.use(cors({ origin: true }));
app3.use(common.decodeIDTokenForLogin)
app3.post('/SignUp', async (req, res) => SuperAdminFunctions.Create(req, res))

app3.post('/Login', async (req, res) => SuperAdminFunctions.Login(req, res))
exports.LoginForStoreAdmin = functions.region("asia-south1").https.onRequest(app3);