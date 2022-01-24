const functions = require('firebase-functions');
const admin = require('firebase-admin');

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));

const UsersFunctions = require('../services/Users')

app.post('/CreateUsers', async (req, res) => UsersFunctions.Create(req, res))

app.post('/ReadUsers', async (req, res) => UsersFunctions.Read(req, res))

app.post('/UpdateUsers', async (req, res) => UsersFunctions.Update(req, res))

app.post('/DeleteUsers', async (req, res) => UsersFunctions.Delete(req, res))

app.post('/RedeemPoints', async (req, res) => UsersFunctions.Redeem(req, res))

exports.Users = functions.region("asia-south1").https.onRequest(app);