const functions = require('firebase-functions');
const admin = require('firebase-admin');
const common= require('../common')
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));

app.use(common.decodeIDToken)


const StoreAdminsFunctions = require('../services/StoreAdmins')

app.post('/CreateStoreAdmins', async (req, res) => StoreAdminsFunctions.Create(req, res))

app.post('/ReadStoreAdmins', async (req, res) => StoreAdminsFunctions.Read(req, res))

app.post('/UpdateStoreAdmins', async (req, res) => StoreAdminsFunctions.Update(req, res))

app.post('/DeleteStoreAdmins', async (req, res) => StoreAdminsFunctions.Delete(req, res))

app.post('/ReadAddHistory', async (req, res) => StoreAdminsFunctions.ReadAddHistory(req, res))

app.post('/ReadRedeemHistory', async(req,res)=> StoreAdminsFunctions.ReadRedeemHistory(req,res))




exports.StoreAdmins = functions.region("asia-south1").https.onRequest(app);