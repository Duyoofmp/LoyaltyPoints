const functions = require('firebase-functions');
const admin = require('firebase-admin');
const dataHandling = require("../functions");
const common = require('../common')

async function Create(req, res) {
    req.body.index = Date.now();
    const check = await dataHandling.WhereGet("Staffs", "Username", req.body.Username)
    if (check) {
        const PhoneNumber = req.body.CountryCode + req.body.PhoneNumber
        admin.auth().createUser({
            phoneNumber: String(PhoneNumber),
            displayName: req.body.Username
        }).then(async (snap) => {
            const DocId = snap.uid;
            await dataHandling.Create("Staffs", req.body, DocId)
            const id = await admin.auth().createCustomToken(DocId);
            return res.json(true);
        }).catch(err => {
            return res.json({
                "message": err
            })
        })
    }
    else {
        return res.json({
            "message": "Username Already Exists"
        });
    }
}

async function Update(req, res) {
    req.body.index = Date.now()
    if (req.body.Username !== undefined) {
        const check = await dataHandling.WhereGet("Staffs", "Username", req.body.Username)
        if (!check) {
            const data = await dataHandling.Read("Staffs", req.body.DocId);
            if (data.Username === req.body.Username) {
                await dataHandling.Update("Staffs", req.body, req.body.DocId)
                return res.json(true)
            } else {
                return res.json({
                    "message": "Username Already exists"
                })
            }
        } else {
            return res.json({
                "message": "No Staff With Username"
            })
        }

    } else {
        await dataHandling.Update("Staffs", req.body, req.body.DocId)
        return res.json(true)
    }
}

async function Delete(req, res) {
    await dataHandling.Delete("Staffs", req.body.DocId)
    return res.json(true)
}

async function Read(req, res) {
    const data = await dataHandling.Read("Staffs", req.body.UserId, req.body.index, req.body.Keyword, req.body.limit)
    delete data.Keywords
    return res.json(data)
}

async function Login(req, res) {
    const checkuser = await dataHandling.Read("Staffs", undefined, undefined, undefined, undefined, ["Username", "==", req.body.Username], ["desc"])
    if (checkuser.length === 1) {
        if (checkuser[0].password === req.body.password) {
            const id = await admin.auth().createCustomToken(checkuser[0].DocId);
            return res.json({
                "token": id,
                "role": "Staff"
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

async function ReadStoreStaffs(req, res) {
    const data = await dataHandling.Read("Staffs", req.body.UserId, req.body.index, req.body.Keyword, req.body.limit, ["StoreAdminId", "==", req.body.StoreAdminId], ["desc"]);
    delete data.Keywords
    return res.json(data)
}

module.exports = {
    Create,
    Update,
    Delete,
    Read,
    ReadStoreStaffs,
    Login
}