const functions = require('firebase-functions');
const admin = require('firebase-admin');
const dataHandling = require("../functions");

async function Create(req, res) {
        req.body.index = Date.now();
    const check = await dataHandling.WhereGet("StoreAdmins", "Username", req.body.Username)
    if (check) {
       
        admin.auth().createUser({
            phoneNumber: String(req.body.PhoneNumber),
            displayName: req.body.Username
        }).then(async (snap)=>{
            const DocId = snap.uid;
            await dataHandling.Create("StoreAdmins", req.body, DocId);
            const id = await admin.auth().createCustomToken(DocId);
            return res.json(id);
        }).catch(err=>{
            return res.json("Phone Number Already Exist !");
            
        })
       
    }
    else {
        return res.json(false);
    }
    
    
}

async function Update(req, res) {
    req.body.index = Date.now()
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
    const data = await dataHandling.Read("StoreAdmins", req.body.DocId, req.body.index, req.body.Keyword, req.body.limit);
    delete data.Keywords
    return res.json(data)
}

async function ReadAddHistory(req, res) {
    if (req.body.Date !== undefined) {
        const data = await dataHandling.Read(`StoreAdmins/${req.body.StoreAdminId}/AddHistory`, req.body.DocId, req.body.index, req.body.Keyword, req.body.limit, ["Date", "==", req.body.Date], ["desc"])
        return res.json(data)
    }
    else {
        const data = await dataHandling.Read(`StoreAdmins/${req.body.StoreAdminId}/AddHistory`, req.body.DocId, req.body.index, req.body.Keyword, req.body.limit, undefined, ["desc"])
        return res.json(data)
    }

}

async function ReadRedeemHistory(req, res) {
    if (req.body.Date !== undefined) {
        const data = await dataHandling.Read(`StoreAdmins/${req.body.StoreAdminId}/RedeemHistory`, req.body.DocId, req.body.index, req.body.Keyword, req.body.limit, ["Date", "==", req.body.Date], ["desc"])
        return res.json(data)
    }
    else {
        const data = await dataHandling.Read(`StoreAdmins/${req.body.StoreAdminId}/RedeemHistory`, req.body.DocId, req.body.index, req.body.Keyword, req.body.limit, undefined, "desc")
        return res.json(data)
    }

}
module.exports = {
    Create,
    Update,
    Delete,
    Read,
    ReadAddHistory,
    ReadRedeemHistory
}