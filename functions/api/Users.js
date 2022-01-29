const functions = require('firebase-functions');
const admin = require('firebase-admin');
const common= require('../common')
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));

app.use(common.decodeIDToken)


const UsersFunctions = require('../services/Users')

app.post('/CreateUsers', async (req, res) => UsersFunctions.Create(req, res))

app.post('/ReadUsers', async (req, res) => UsersFunctions.Read(req, res))

app.post('/UpdateUsers', async (req, res) => UsersFunctions.Update(req, res))

app.post('/DeleteUsers', async (req, res) => UsersFunctions.Delete(req, res))

app.post('/RedeemPoints', async (req, res) => UsersFunctions.Redeem(req, res))

app.post('/AddPoints', async (req, res) => UsersFunctions.AddPoints(req, res))

app.post('/ReadAddHistory', async (req, res) => UsersFunctions.ReadAddHistory(req, res))

app.post('/ReadRedeemHistory', async(req,res)=> UsersFunctions.ReadRedeemHistory(req,res))





exports.Users = functions.region("asia-south1").https.onRequest(app);