const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();
const common = require('../common')



exports.OnStoreAdminsCreate = functions.firestore
    .document("StoreAdmins/{docid}")
    .onCreate(async (change, context) => {
        const docid = context.params.docid;
        const data = change.data()
        const arr = [];
        common.createKeywords(data.StoreAdminName, arr)
        return await db.collection("StoreAdmins").doc(docid).update({ DocId: docid, Keywords: arr })
    })


exports.OnStoreAdminsUpdate = functions.firestore
    .document("StoreAdmins/{docid}")
    .onUpdate(async (change, context) => {
        const docid = context.params.docid;
        const data = change.after.data()
        const arr = [];
        common.createKeywords(data.StoreAdminName, arr)
        return await db.collection("StoreAdmins").doc(docid).update({ Keywords: arr })

    })



