const functions = require("firebase-functions");
const admin = require("firebase-admin");
const db = admin.firestore();

async function Create(collectionName, data, docName,) {
    return new Promise(async (resolve, reject) => {
        try {
            if (docName !== undefined) {

                await db.collection(collectionName).doc(docName).set(data,{"merge":true });
                resolve(true);
            } else {
                const done = await db.collection(collectionName).add(data);
                resolve(done.id);
            }
        } catch (error) {
            functions.logger.error(error);
            reject(false);
        }
    });
}

async function Update(collectionName, data, docName) {
    return new Promise(async (resolve, reject) => {
        try {
            await db.collection(collectionName).doc(docName).set(data, { "merge": true });
            resolve(true);
        } catch (error) {
            functions.logger.error(error);
            reject(false);
        }
    });
}

async function Delete(collectionName, docName) {
    return new Promise(async (resolve, reject) => {
        try {
            await db.collection(collectionName).doc(docName).delete();
            resolve(true);
        } catch (error) {
            functions.logger.error(error);
            reject(false);
        }
    });
}

async function Read(collectionName, docName, index, Keyword, limit = 10, where, orderBy = [true, "index", "desc"]) {

    let query;
    if (docName === undefined || docName === "") {
        query = db.collection(collectionName);
        if (Keyword !== "" && Keyword !== undefined) {
            query = query.where("Keywords", "array-contains", Keyword.toLowerCase());
        }
        if (where !== undefined) {
            for (let where_index = 0; where_index < where.length; where_index = where_index + 3) {
                query = query.where(where[where_index], where[where_index + 1], where[where_index + 2])
            }
        }
        if (orderBy[0] === true) {
            for (let orderByIndex = 1; orderByIndex < orderBy.length; orderByIndex = orderByIndex + 2) {
                const element = orderBy
                query = query.orderBy(element[orderByIndex], element[orderByIndex + 1]);
            }
        }

        if (index !== undefined && index !== null && index !== 0 && index !== "") {
            const snapshot = await db.collection(collectionName).doc(index).get();
            query = query.startAfter(snapshot);
        }
    }
    else {
        query = db.collection(collectionName).doc(docName)
    }
    return new Promise(async (resolve, reject) => {
        try {
            if (docName === undefined || docName === "") {
                const temp = [];
                const data = await query.limit(limit).get();
                data.forEach((doc) => {
                    if (doc.exists) {
                        const r = doc.data();
                        delete r.Keywords;
                        delete r.StaffIds;
                        delete r.StoreAdminIds;
                        temp.push({ ...r, DocId: doc.id });
                    }
                });
                resolve(temp);
            }
            else {
                const dat = await query.get();
                if (dat.exists) {
                    resolve({ ...dat.data(), DocId: dat.id });
                }
                else {
                    resolve(null);
                }
            }
        }
        catch (error) {
            functions.logger.error(error);
            reject(false);
        }
    });
}


async function WhereGet(collectionName, Field, data, DocId) {
    return new Promise(async (resolve, reject) => {
        return db
            .collection(collectionName)
            .where(Field, "==", data)
            .limit(1)
            .get()
            .then((snap) => {
                if (snap.size === 0) {
                    resolve(true);
                } else {
                    if (DocId !== undefined) {
                        if (snap.docs[0].id === DocId) {
                            resolve(true);
                        }
                    }
                    resolve(false);
                }
            })
            .catch((err) => {
                functions.logger.error(err);
                reject(false);
            });
    });
}


module.exports = {
    Create,
    Update,
    Delete,
    Read,

    WhereGet
};
