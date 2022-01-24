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
    const Amount = req.body.Amount;
    delete req.body.Amount;
    const check = await dataHandling.WhereGet("Users", "Username", req.body.Username)
    if (check) {
        const PhoneNumber = req.body.PhoneNumber
        const user = await admin.auth().createUser({
            phoneNumber: PhoneNumber,
            displayName: req.body.UserName
        })
        const DocId = user.uid;
        const data = await dataHandling.Create("Users", req.body, DocId);
        await admin.firestore().collection("Users").doc(data).collection("StoreAdmins").add({
            Points: Amount * 0.5,
        })
        return res.json(true);
    }
    else {
        return res.json(false)
    }
}

async function Update(req, res) {
    const check = await dataHandling.WhereGet("Users", "Username", req.body.Username)
    if (check) {
        await dataHandling.Update("Users", req.body, req.body.DocId)
        res.json(true)
    }
    else {
        return res.json("Username already exists");
    }
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
    const query = await dataHandling.Read(`Users/${req.body.DocId}/StoreAdmins`, req.body.StoreAdminId);
    let Points = query.data().Points
    Points = Points - req.body.Points;
    await dataHandling.Update(`Users/${req.body.DocId}/StoreAdmins`, { Points: Points }, req.body.StoreAdminId)
    return res.json(true)
}

async function AddPoints(req, res) {
    const query = await dataHandling.Read(`Users/${req.body.DocId}/StoreAdmins`, req.body.StoreAdminId);
    let Points = query.Points;
    const data = await dataHandling.Read(`StoreAdmins/${req.body.StoreAdminId}/Category`, undefined, undefined, undefined, 1, ["CategoryID", "==", req.body.CategoryId])
    Points = Points + req.body.Amount * data.Percentage
    await dataHandling.Update(`Users/${req.body.DocId}/StoreAdmins`, { Points: Points }, req.body.StoreAdminId)
    return res.json(true)
}

module.exports = {
    Create,
    Update,
    Delete,
    Read,
    Redeem,
    AddPoints
}