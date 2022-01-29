const functions = require('firebase-functions');
const admin = require('firebase-admin');
const dataHandling = require("../functions");
const common = require('../common')

async function Create(req, res) {
    req.body.index = Date.now();
    const check = await dataHandling.WhereGet("Staffs", "Username", req.body.Username)
    if (check) {
        const PhoneNumber = req.body.CountryCode + req.body.PhoneNumber
        const user = await admin.auth().createUser({
            phoneNumber: String(PhoneNumber),
            displayName: req.body.Username
        })
        const DocId = user.uid;
        await dataHandling.Create("Staffs", req.body, DocId);
        return res.json(true);
    }
    else {
        return res.json(false);
    }
}

async function Update(req, res) {
    req.body.index = Date.now()
    const check = await dataHandling.WhereGet("Staffs", "Username", req.body.Username)
    if (check) {
        await dataHandling.Update("Staffs", req.body, req.body.DocId)
        return res.json(true)
    } else {
        return res.json("Username Already exists")
    }
}

async function Delete(req, res) {
    await dataHandling.Delete("Staffs", req.body.DocId)
    return res.json(true)
}

async function Read(req, res) {
    const data = await dataHandling.Read("Staffs", req.body.DocId, req.body.index, req.body.Keyword, req.body.limit)
    delete data.Keywords
    return res.json(data)
}

async function Login(req, res) {
    const checkuser = await dataHandling.Read("Staffs", undefined, undefined, undefined, undefined, ["Username", "==", req.body.Username], ["desc"])
    if (checkuser.size === 1) {
        if (checkuser[0].password === req.body.password) {
            const id = await admin.auth().createCustomToken(checkuser[0].DocId);
            return res.json(id)
        }
        else {
            return res.json("Incorrect Password")
        }
    }
    else {
        return res.json("Invalid Username")
    }
}

module.exports = {
    Create,
    Update,
    Delete,
    Read,
    Login
}