const functions = require('firebase-functions');
const admin = require('firebase-admin');
const dataHandling = require("../functions");
const moment = require('moment');

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));

const LoyalFunctions = require('../services/LoyaltyAdmin')

app.post('/RazorPayCall', async (req, res) => {
  const set = await dataHandling.Read("LoyaltyAdmin", "Settings")
  const ordrData = {
    Amount: set.Amount,
    index: Date.now(),
    OrderDate: moment().format("YYYY-MM-DD")
  }
  return res.json(await LoyalFunctions.RazorpayCall(ordrData))
})

app.post('/CreateSettings', async (req, res) => LoyalFunctions.Create(req, res))

app.post('/UpdateSettings', async (req, res) => LoyalFunctions.Update(req, res))

app.post('/ReadSettings', async (req, res) => LoyalFunctions.Read(req, res))

app.post('/DeleteSettings', async (req, res) => LoyalFunctions.Delete(req, res))

exports.Loyalty = functions.region("asia-south1").https.onRequest(app);
