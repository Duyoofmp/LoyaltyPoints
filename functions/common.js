const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();

const createKeywords = (name, resultArr) => {
    if (name === undefined) { name = "" }
    let curName = '';
    let temp = name;
    let len = name.split(' ').length;
    for (let i = 0; i < len; i++) {
        for (let k = 0; k < temp.split('').length; k++) {
            letter = temp[k]
            curName += letter.toLowerCase();
            if (!resultArr.includes(curName)) {
                resultArr.push(curName);
            }
        }
        temp = temp.split(' ')
        temp.splice(0, 1);
        temp = temp.join(" ")
        curName = '';
    }
}

module.exports = {
    createKeywords
}