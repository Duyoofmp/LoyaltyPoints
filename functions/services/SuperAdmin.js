const functions = require('firebase-functions');
const admin = require('firebase-admin');
const dataHandling = require("../functions");

async function Create(req, res) {
    req.body.index = Date.now();
    await dataHandling.Create("SuperAdmin", req.body);
    return res.json(true)
}

async function Login(req, res) {
    const checkuser = await dataHandling.Read("SuperAdmin", undefined, undefined, undefined, undefined, ["Username", "==", req.body.Username], ["desc"])
    if (checkuser.length === 1) {
        if (checkuser[0].password === req.body.password) {
            const id = await admin.auth().createCustomToken(checkuser[0].DocId);
            return res.json({
                "token": id,
                "role": "SuperAdmin"
            })
        }
        else {
            return res.json({
                "message": "Incorrect Password"
            })
        }
    }
    else {
        return res.json({
            "message": "Invalid Username"
        })
    }
}

module.exports = {
    Create,
    Login
}