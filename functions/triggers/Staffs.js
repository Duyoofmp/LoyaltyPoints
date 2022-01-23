const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();
const common = require('../common')



exports.OnStaffsCreate = functions.firestore
    .document("Staffs/{docid}")
    .onCreate(async (change, context) => {
        const docid = context.params.docid;
        const data = change.data()
        const arr = [];
        common.createKeywords(data.StaffName, arr)
        return await db.collection("Staffs").doc(docid).update({ DocId: docid, Keywords: arr })
    })


exports.OnStaffsUpdate = functions.firestore
    .document("Staffs/{docid}")
    .onUpdate(async (change, context) => {
        const docid = context.params.docid;
        const data = change.after.data()
        const arr = [];
        common.createKeywords(data.StaffName, arr)
        return await db.collection("Staffs").doc(docid).update({ Keywords: arr })

    })



