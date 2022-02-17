const functions = require('firebase-functions');
const admin = require('firebase-admin');
const common = require('../../common')
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));
app.use(common.decodeIDTokenHeader)

const HomeFunctions = require('../../services/UserServices/Home.js')

app.post('/ShowProfile', async (req, res) => HomeFunctions.ShowProfile(req, res));

app.post('/ReadStoreAdmins', async (req, res) => HomeFunctions.ReadStoreAdmins(req, res));

app.post('/ReadSuperBanners', async (req, res) => HomeFunctions.ReadSuperBanners(req, res))

exports.Home = functions.region('asia-south1').https.onRequest(app)