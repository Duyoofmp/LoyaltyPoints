const functions = require('firebase-functions');
const admin = require('firebase-admin');
const common = require('../../common')
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));
app.use(common.decodeIDTokenHeader)

const StoreAdminsFunctions = require('../../services/UserServices/StoreAdmin')


app.post("/EditProfile", async (req, res) => StoreAdminsFunctions.EditProfile(req, res))

app.post("/ReadStoreAdmin", async (req, res) => StoreAdminsFunctions.Read(req, res))


exports.StoreAdminUser = functions.region('asia-south1').https.onRequest(app)