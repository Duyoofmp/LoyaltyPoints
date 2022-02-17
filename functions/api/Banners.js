const functions = require('firebase-functions');
const admin = require('firebase-admin');

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));

const common = require("../common");
app.use(common.decodeIDToken)


const BannerFunctions = require('../services/Banners')

app.post('/CreateBanner', async (req, res) => BannerFunctions.Create(req, res))

app.post('/ReadBanner', async (req, res) => BannerFunctions.Read(req, res))

app.post('/UpdateBanner', async (req, res) => BannerFunctions.Update(req, res))

app.post('/DeleteBanner', async (req, res) => BannerFunctions.Delete(req, res))




exports.Banners = functions.region("asia-south1").https.onRequest(app);