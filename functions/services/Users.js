const functions = require('firebase-functions');
const admin = require('firebase-admin');
const dataHandling = require("../functions");
const moment = require('moment');

async function Create(req, res) {
    let StoreAdminIds = [];
    let StaffIds = [];
    req.body.index = Date.now();
    /*   if (req.body.StaffId !== undefined) {
           let query = await dataHandling.Read("Staffs", req.body.StaffId);
           req.body.StoreAdminId = query.StoreAdminId
       }*/
    const PhoneNumber = String(req.body.CountryCode) + String(req.body.PhoneNumber);
    admin.auth().createUser({
        phoneNumber: PhoneNumber,
        displayName: req.body.UserName
    }).then(async snap => {
        const DocId = snap.uid;
        let point = 0;
        if (req.body.Amount !== undefined) {
            const data = await dataHandling.Read(`StoreAdmins/${req.body.StoreAdminId}/Category`, req.body.CategoryId)
            point = req.body.Amount * data.Percentage
            delete req.body.Amount;
            delete req.body.CategoryId
        }

        const StoreAdminId = req.body.StoreAdminId;
        StoreAdminIds.push(StoreAdminId)
        req.body.StoreAdminIds = StoreAdminIds
        delete req.body.StoreAdminId;
        if (req.body.StaffId !== undefined) {
            StaffIds.push(req.body.StaffId);
            req.body.StaffIds = StaffIds
        }
        const StaffId = req.body.StaffId;
        delete req.body.StaffId;
        await dataHandling.Create("Users", req.body, DocId);
        if (StaffId !== undefined) {
            await admin.firestore().collection("Users").doc(DocId).collection("StoreAdmins").doc(StoreAdminId).set({
                "Points": point,
                "StaffId": StaffId
            }, { merge: true })
            return res.json(true);
        } else {
            await admin.firestore().collection("Users").doc(DocId).collection("StoreAdmins").doc(StoreAdminId).set({
                "Points": point,
            }, { merge: true })
            return res.json(true);
        }
    }).catch(err => {
        return res.json({
            "message": err
        })
    })
}

async function Update(req, res) {
    req.body.index = Date.now();
    await dataHandling.Update("Users", req.body, req.body.DocId)
    res.json(true)
}


async function Delete(req, res) {
    await dataHandling.Delete("Users", req.body.DocId)
    return res.json(true)
}

async function Read(req, res) {
    const data = await dataHandling.Read("Users", req.body.UserId, req.body.index, req.body.Keyword, req.body.limit)
    return res.json(data)
}

async function Redeem(req, res) {
    const query = await dataHandling.Read(`Users/${req.body.DocId}/StoreAdmins`, req.body.StoreAdminId);
    let Points = query.Points
    Points = Points - req.body.Points;
    await dataHandling.Update(`Users/${req.body.DocId}/StoreAdmins`, { Points: Points }, req.body.StoreAdminId)
    await admin.firestore().collection("Users").doc(req.body.DocId).collection("RedeemHistory").add({
        Date: moment().format('YYYY-MMMM-DD'),
        Points: req.body.Points,
        StoreAdminId: req.body.StoreAdminId,
        index: Date.now()
    })
    await admin.firestore().collection("StoreAdmins").doc(req.body.StoreAdminId).collection("RedeemHistory").add({
        Date: moment().format('YYYY-MMMM-DD'),
        Points: req.body.Points,
        UserId: req.body.DocId,
        index: Date.now()
    })
    return res.json(true)
}

async function AddPoints(req, res) {
    const query = await dataHandling.Read(`Users/${req.body.DocId}/StoreAdmins`, req.body.StoreAdminId);
    let Points = query.Points;
    const data = await dataHandling.Read(`StoreAdmins/${req.body.StoreAdminId}/Category`, req.body.CategoryId)
    Points = Points + req.body.Amount * data.Percentage
    await dataHandling.Update(`Users/${req.body.DocId}/StoreAdmins`, { Points: Points }, req.body.StoreAdminId)
    await admin.firestore().collection("Users").doc(req.body.DocId).collection("AddHistory").add({
        Date: moment().format('YYYY-MMMM-DD'),
        Points: req.body.Points,
        StoreAdminId: req.body.StoreAdminId,
        index: Date.now()
    })
    await admin.firestore().collection("StoreAdmins").doc(req.body.StoreAdminId).collection("AddHistory").add({
        Date: moment().format('YYYY-MMMM-DD'),
        Points: req.body.Points,
        UserId: req.body.DocId,
        index: Date.now()
    })
    return res.json(true)
}

async function ReadAddHistory(req, res) {
    if (req.body.Date !== undefined) {
        const data = await dataHandling.Read(`Users/${req.body.UserId}/AddHistory`, req.body.DocId, req.body.index, req.body.Keyword, req.body.limit, ["Date", "==", req.body.Date], ["desc"])
        return res.json(data)
    }
    else {
        const data = await dataHandling.Read(`Users/${req.body.UserId}/AddHistory`, req.body.DocId, req.body.index, req.body.Keyword, req.body.limit, undefined, ["desc"])
        console.log(data)
        return res.json(data)
    }

}

async function ReadRedeemHistory(req, res) {
    if (req.body.Date !== undefined) {
        const data = await dataHandling.Read(`Users/${req.body.UserId}/RedeemHistory`, req.body.DocId, req.body.index, req.body.Keyword, req.body.limit, ["Date", "==", req.body.Date], ["desc"])
        return res.json(data)
    }
    else {
        const data = await dataHandling.Read(`Users/${req.body.UserId}/RedeemHistory`, req.body.DocId, req.body.index, req.body.Keyword, req.body.limit, undefined, ["desc"])
        return res.json(data)
    }

}

async function ReadStoreUsers(req, res) {
    if (req.body.StaffId !== undefined) {
        const data = await dataHandling.Read("Users", req.body.DocId, req.body.index, req.body.Keyword, req.body.limit, ["StaffIds", "array-contains", req.body.StaffId], [true, "index", "desc"])
        return res.json(data)
    }
    else {
        const data = await dataHandling.Read("Users", req.body.UserId, req.body.index, req.body.Keyword, req.body.limit, ["StoreAdminIds", "array-contains", req.body.StoreAdminId], [true, "index", "desc"]);
        return res.json(data)
    }

}

module.exports = {
    Create,
    Update,
    Delete,
    Read,
    Redeem,
    AddPoints,
    ReadAddHistory,
    ReadRedeemHistory,
    ReadStoreUsers
}