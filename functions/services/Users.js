const functions = require('firebase-functions');
const admin = require('firebase-admin');
const dataHandling = require("../functions");
const { createKeywords } = require('../common');

async function Create(req, res) {
    req.body.index = Date.now();
    if (req.body.StaffId !== undefined) {
        let query = await dataHandling.Read("Staffs", req.body.StaffId);
        req.body.StoreAdminId = query.StoreAdminId
    }
    const data = await dataHandling.Create("Users", req.body);
    await admin.firestore().collection("Users").doc(data).collection("StoreAdmins").add({
        Points: req.body.Amount * 0.5,
    })
    return res.json(true);
}

async function Update(req, res) {
    await dataHandling.Update("Users", req.body, req.body.DocId)
    res.json(true)
}

async function Delete(req, res) {
    await dataHandling.Delete("Users", req.body.DocId)
    return res.json(true)
}

async function Read(req, res) {
    const data = await dataHandling.Read("Users", req.body.DocId, req.body.index, req.body.Keyword, req.body.limit)
    return res.json(data)
}

async function Redeem(req, res) {
    const query = await admin.firestore().collection("Users").doc(req.body.DocId).collection("StoreAdmins").doc(req.body.StoreAdminId).get();
    let Points = query.data().Points
    console.log(Points)
    Points = Points - req.body.Points;
    await admin.firestore().collection("Users").doc(req.body.DocId).collection("StoreAdmins").doc(req.body.StoreAdminId).update({
        Points: Points
    })
    return res.json(true)
}

module.exports = {
    Create,
    Update,
    Delete,
    Read,
    Redeem
}