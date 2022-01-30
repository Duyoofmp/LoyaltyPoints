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
        if(data.ExpiryDays===0){
await db.collection("StoreAdmins").doc(docid).update({Expiry:true,PaymentStatus:false})
        }
        common.createKeywords(data.StoreAdminName, arr)
        return await db.collection("StoreAdmins").doc(docid).update({ Keywords: arr })

    })

    exports.scheduledFunctionForExpiry = functions.pubsub
    .schedule("5 0 * * *")
    .timeZone("Asia/Kolkata") // Users can choose timezone - default is America/Los_Angeles
    .onRun(async (context) => {
        const promise=[]
   const stores=  await  db.collection("StoreAdmins").get();
   stores.forEach(snap=>{
       if(snap.data().ExpiryDays!==0){
       promise.push(db.collection("StoreAdmins").doc(snap.id).update({ExipryDays:snap.data().ExipryDays-1}))
       }
   })
   return await Promise.all(promise)
    });

