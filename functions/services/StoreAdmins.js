const functions = require('firebase-functions');
const admin = require('firebase-admin');
const dataHandling = require("../functions");

async function Create(req, res) {
    req.body.index = Date.now();
    const check = await dataHandling.WhereGet("StoreAdmins", "Username", req.body.Username)
    if (check) {
        const PhoneNumber = req.body.PhoneNumber
        const user = await admin.auth().createUser({
            phoneNumber: PhoneNumber,
            displayName: req.body.StoreAdminName
        })
        const DocId = user.uid;
        await dataHandling.Create("StoreAdmins", req.body, DocId);
        return res.json(true);
    }
    else {
        return res.json(false);
    }
}

async function Update(req, res) {
    const check = await dataHandling.WhereGet("StoreAdmins", "Username", req.body.Username)
    if (check) {
        await dataHandling.Update("StoreAdmins", req.body, req.body.DocId)
        return res.json(true)
    } else {
        return res.json("Username Already exists")
    }
}

async function Delete(req, res) {
    await dataHandling.Delete("StoreAdmins", req.body.DocId)
    return res.json(true)
}

async function Read(req, res) {
    const data = await dataHandling.Read("StoreAdmins", req.body.DocId, req.body.index, req.body.Keyword, req.body.limit)
    return res.json(data)
}

module.exports = {
    Create,
    Update,
    Delete,
    Read
}