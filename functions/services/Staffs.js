const functions = require('firebase-functions');
const admin = require('firebase-admin');
const dataHandling = require("../functions");

async function Create(req, res) {
    req.body.index = Date.now();
    await dataHandling.Create("Staffs", req.body);
    return res.json(true);
}

async function Update(req, res) {
    await dataHandling.Update("Staffs", req.body, req.body.DocId)
    res.json(true)
}

async function Delete(req, res) {
    await dataHandling.Delete("Staffs", req.body.DocId)
    return res.json(true)
}

async function Read(req, res) {
    const data = await dataHandling.Read("Staffs", req.body.DocId, req.body.index, req.body.Keyword, req.body.limit)
    return res.json(data)
}

module.exports = {
    Create,
    Update,
    Delete,
    Read
}