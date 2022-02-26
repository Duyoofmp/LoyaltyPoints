const functions = require('firebase-functions');
const admin = require('firebase-admin')
const dataHandling = require("../functions");
const moment = require('moment-timezone');
const common = require('../common')

async function Create(req, res) {
    let promise = [];
    let StoreAdminIds = [];
    let StaffIds = [];
    req.body.index = Date.now();
    const CategoryId = req.body.CategoryId
    delete req.body.CategoryId;
    const UserName = req.body.UserName;
    delete req.body.UserName;
    const StoreData = {
        CategoryId: CategoryId,
        UserName: UserName,
        Points: 0
    }
    if (req.body.Amount !== undefined) {
        const data = await dataHandling.Read(`StoreAdmins/${req.body.StoreAdminId}/Category`, CategoryId)
        StoreData.Points = req.body.Amount * data.Percentage / 100
        delete req.body.Amount;
    }
    const PhoneNumber = String(req.body.CountryCode) + String(req.body.PhoneNumber);
    const checkphone = await dataHandling.Read("Users", undefined, undefined, undefined, undefined, ["PhoneNumber", "==", req.body.PhoneNumber], ["desc"])
    try {
        if (checkphone.length === 0) {
            const user = await admin.auth().createUser({
                phoneNumber: PhoneNumber,
                displayName: UserName
            })
            const DocId = user.uid;
            if (req.body.StaffId !== undefined) {
                const StaffId = req.body.StaffId;
                delete req.body.StaffId;
                StaffIds[0] = StaffId;
                req.body.StaffIds = StaffIds
                StoreData.StaffId = StaffId
            }
            const StoreAdminId = req.body.StoreAdminId;
            delete req.body.StoreAdminId;
            StoreAdminIds[0] = StoreAdminId
            req.body.StoreAdminIds = StoreAdminIds
            await dataHandling.Create("Users", req.body, DocId);
            await dataHandling.Create(`Users/${DocId}/StoreAdmins`, StoreData, StoreAdminId)
            await Promise.all(promise)
            return res.json(true);
        }
        else {
            const DocId = checkphone[0].DocId;
            const user = await dataHandling.Read("Users", DocId);
            const check = await common.checkarray(user.StoreAdminIds, req.body.StoreAdminId)
            if (check) {
                if (req.body.StaffId !== undefined) {
                    promise.push(admin.firestore().collection("Users").doc(DocId).update({
                        StaffIds: admin.firestore.FieldValue.arrayUnion(req.body.StaffId)
                    }))
                    StoreData.StaffId = req.body.StaffId
                }
                promise.push(admin.firestore().collection("Users").doc(DocId).update({
                    StoreAdminIds: admin.firestore.FieldValue.arrayUnion(req.body.StoreAdminId)
                }))
                promise.push(dataHandling.Create(`Users/${DocId}/StoreAdmins`, StoreData, req.body.StoreAdminId))
                await Promise.all(promise)
                return res.json(true)
            } else {
                return res.json({
                    message: "User Already Exists"
                })
            }
        }
    }
    catch (err) {
        return res.json({
            "message": err.message
        })
    }
}

async function Update(req, res) {
    req.body.index = Date.now();
    await dataHandling.Update(`Users/${req.body.DocId}/StoreAdmins`, req.body, req.body.StoreAdminId)
    res.json(true)
}


async function Delete(req, res) {
    await admin.firestore().collection("Users").doc(req.body.DocId).update({
        StoreAdminIds: admin.firestore.FieldValue.arrayRemove(req.body.StoreAdminId)
    })
    await dataHandling.Delete(`Users/${req.body.DocId}/StoreAdmins`, req.body.StoreAdminId)
    return res.json(true)
}

async function Read(req, res) {
    const data = await dataHandling.Read(`Users/${req.body.DocId}/StoreAdmins`, req.body.StoreAdminId, req.body.index, req.body.Keyword, req.body.limit);
    delete data.DocId;
    delete data.Keywords;
    const user = await dataHandling.Read("Users", req.body.DocId);
    return res.json({ ...data, PhoneNumber: user.PhoneNumber, CountryCode: user.CountryCode, DocId: user.DocId })
}

async function Redeem(req, res) {
    const user = await dataHandling.Read("Users", req.body.DocId);
    if (user.OTP === req.body.OTP) {
        const query = await dataHandling.Read(`Users/${req.body.DocId}/StoreAdmins`, req.body.StoreAdminId);
        let Points = query.Points
        if (Points > req.body.Points) {
            Points = Points - req.body.Points;
            await dataHandling.Update(`Users/${req.body.DocId}/StoreAdmins`, { Points: Points }, req.body.StoreAdminId)
            await admin.firestore().collection("Users").doc(req.body.DocId).collection("RedeemHistory").add({
                Date: moment().tz('Asia/Kolkata').format('YYYY-MM-DD'),
                Points: req.body.Points,
                StoreAdminId: req.body.StoreAdminId,
                index: Date.now()
            })
            await admin.firestore().collection("StoreAdmins").doc(req.body.StoreAdminId).collection("RedeemHistory").add({
                Date: moment().tz('Asia/Kolkata').format('YYYY-MM-DD'),
                Points: req.body.Points,
                UserId: req.body.DocId,
                index: Date.now()
            })
            return res.json(true)
        } else {
            return res.json({
                message: "Insufficient Points"
            })
        }
    } else {
        return res.json({
            message: "Wrong Verification Code"
        })
    }
}

async function AddPoints(req, res) {
    let promise = [];
    const query = await dataHandling.Read(`Users/${req.body.DocId}/StoreAdmins`, req.body.StoreAdminId);
    let Points = query.Points;
    const data = await dataHandling.Read(`StoreAdmins/${req.body.StoreAdminId}/Category`, req.body.CategoryId)
    const points = req.body.Amount * data.Percentage
    Points = Points + points
    await dataHandling.Update(`Users/${req.body.DocId}/StoreAdmins`, { Points: Points }, req.body.StoreAdminId);
    await dataHandling.Create(`Users/${req.body.DocId}/AddHistory`, {
        Date: moment().tz('Asia/Kolkata').format('YYYY-MM-DD'),
        Points: points,
        StoreAdminId: req.body.StoreAdminId,
        Amount: req.body.Amount,
        index: Date.now()
    })
    await dataHandling.Create(`StoreAdmins/${req.body.StoreAdminId}/AddHistory`, {
        Date: moment().tz('Asia/Kolkata').format('YYYY-MM-DD'),
        Points: points,
        UserId: req.body.DocId,
        Amount: req.body.Amount,
        index: Date.now()
    })
    return res.json(true)
}

async function ReadAddHistory(req, res) {
    if (req.body.Date === undefined || req.body.Date === "") {
        const data = await dataHandling.Read(`Users/${req.body.DocId}/AddHistory`, undefined, req.body.index, req.body.Keyword, req.body.limit, ["StoreAdminId", "==", req.body.StoreAdminId], ["desc"])
        return res.json(data)
    }
    else {
        const data = await dataHandling.Read(`Users/${req.body.DocId}/AddHistory`, undefined, req.body.index, req.body.Keyword, req.body.limit, ["Date", "==", req.body.Date, "StoreAdminId", "==", req.body.StoreAdminId], ["desc"])
        return res.json(data)
    }

}

async function ReadRedeemHistory(req, res) {
    if (req.body.Date === undefined || req.body.Date === "") {
        const data = await dataHandling.Read(`Users/${req.body.DocId}/RedeemHistory`, undefined, req.body.index, req.body.Keyword, req.body.limit, ["StoreAdminId", "==", req.body.StoreAdminId], ["desc"])
        return res.json(data)
    }
    else {
        const data = await dataHandling.Read(`Users/${req.body.DocId}/RedeemHistory`, undefined, req.body.index, req.body.Keyword, req.body.limit, ["Date", "==", req.body.Date, "StoreAdminId", "==", req.body.StoreAdminId], ["desc"])
        return res.json(data)
    }

}

async function ReadStoreUsers(req, res) {
    let temp = [];
    if (req.body.StaffId === undefined || req.body.StaffId === "") {
        const user = await dataHandling.Read("Users", req.body.DocId, req.body.index, req.body.Keyword, req.body.limit, ["StoreAdminIds", "array-contains", req.body.StoreAdminId], [true, "index", "desc"]);
        for (let i = 0; i < user.length; i++) {
            const data = await dataHandling.Read(`Users/${user[i].DocId}/StoreAdmins`, req.body.StoreAdminId);
            delete data.DocId;
            delete data.Keywords;
            data.PhoneNumber = user[i].PhoneNumber;
            data.CountryCode = user[i].CountryCode;
            data.DocId = user[i].DocId;
            temp.push(data)
        }
        return res.json(temp)
    }
    else {
        const user = await dataHandling.Read("Users", req.body.DocId, req.body.index, req.body.Keyword, req.body.limit, ["StaffIds", "array-contains", req.body.StaffId], [true, "index", "desc"])
        for (let i = 0; i < user.length; i++) {
            const data = await dataHandling.Read(`Users/${user[i].DocId}/StoreAdmins`, req.body.StoreAdminId);
            delete data.DocId;
            data.PhoneNumber = user[i].PhoneNumber;
            data.CountryCode = user[i].CountryCode;
            data.DocId = user[i].DocId;
            temp.push(data)
        }
        return res.json(temp)
    }
}

async function SendOtp(req, res) {
    await common.SendOtp(req.body.DocId);
    return res.json(true)
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
    ReadStoreUsers,
    SendOtp
}