const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();
const common = require('../common');
const moment = require('moment');

exports.OnUsersCreate = functions.firestore
    .document("Users/{docid}")
    .onCreate(async (change, context) => {
        const docid = context.params.docid;
        const data = change.data()
        const arr = [];
        common.createKeywords(data.UserName, arr)
        return await db.collection("Users").doc(docid).update({ DocId: docid, Keywords: arr })
    })


exports.OnUsersUpdate = functions.firestore
    .document("Users/{docid}")
    .onUpdate(async (change, context) => {
        const docid = context.params.docid;
        const data = change.after.data()
        const arr = [];
        common.createKeywords(data.UserName, arr)
        return await db.collection("Users").doc(docid).update({ Keywords: arr })

    })

exports.OnPointsUpdate = functions.firestore
    .document("Users/{userid}/StoreAdmins/{docid}")
    .onUpdate(async (change, context) => {
        const userid = context.params.userid;
        const docid = context.params.docid;
        const dataold = change.before.data()
        const datanew = change.after.data()
        const data =await db.collection('Users').doc(userid).get()
       // const StoreAdminId = data.data().StoreAdminId
        const Points = datanew.Points - dataold.Points
        if (Points > 0) {
            await db.collection("Users").doc(userid).collection("AddHistory").add({
                Date: moment().format('YYYY-MMMM-DD'),
                Points: Points,
                StoreAdminId:docid,
                index: Date.now()
            })
            await db.collection("StoreAdmins").doc(docid).collection("AddHistory").add({
                Date: moment().tz('Asia/Kolkata').format('YYYY-MMMM-DD'),
                Points: Points,
                index: Date.now()
            })
        }
    })




