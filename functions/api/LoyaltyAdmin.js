const functions = require('firebase-functions');
const admin = require('firebase-admin');
const dataHandling = require("../functions");
const moment = require('moment');

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));

const LoyalFunctions=require('../services/LoyaltyAdmin')

app.post('/RazorPayCall', async (req, res) =>{
   const set= await dataHandling.Read("LoyaltyAdmin","Settings")
   const ordrData={
       Amount:set.Amount,
       index:Date.now(),
       OrderDate:moment().format("YYYY-MM-DD")
   }
  return  res.json(await LoyalFunctions.RazorpayCall(ordrData))
})
exports.Loyalty = functions.region("asia-south1").https.onRequest(app);
