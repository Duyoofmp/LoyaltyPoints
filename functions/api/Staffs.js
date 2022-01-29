const functions = require('firebase-functions');
const admin = require('firebase-admin');
const common= require('../common')
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));

app.use(common.decodeIDToken)


const StaffsFunctions = require('../services/Staffs')

app.post('/CreateStaffs', async (req, res) => StaffsFunctions.Create(req, res))

app.post('/ReadStaffs', async (req, res) => StaffsFunctions.Read(req, res))

app.post('/UpdateStaffs', async (req, res) => StaffsFunctions.Update(req, res))

app.post('/DeleteStaffs', async (req, res) => StaffsFunctions.Delete(req, res))

exports.Staffs = functions.region("asia-south1").https.onRequest(app);