const functions = require('firebase-functions');
const admin = require('firebase-admin');
const dataHandling = require("../../functions");

async function EditProfile(req, res) {
    await dataHandling.Update("StoreAdmins", req.body, req.body.DocId);
    return res.json(true)
}

async function Read(req, res) {
    const query = await admin.firestore().collection("StoreAdmins").doc(req.body.StoreAdminId).get();
    const data = query.data();
    return res.json(data)
}

module.exports = {
    EditProfile,
    Read
}