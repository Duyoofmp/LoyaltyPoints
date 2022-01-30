const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();
const auth = admin.auth();

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

async function decodeIDToken(req, res, next) {
    functions.logger.log(req.body)
  
    if (req.body.blahblah === 'blahblah') {
      functions.logger.log("coldstart");
      return res.json('coldstart')
    }
    functions.logger.log(req.path);
  
    const idToken = req.body.token;
  
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      console.log(decodedToken.uid);
     // const adminUid = (await db.collection("Admin").doc("Admin_Info").get()).data().uid
     // if (decodedToken.uid === adminUid) 
        req.body.UserId = decodedToken.uid;
        // req.body.token = decodedToken.uid;
        delete req.body.token;
        return next();
      // else {
      //  return res.json({ 'message': 'token not verified' });
  
     // }
  
    } catch (err) {
      functions.logger.error(err);
      req.body.UserId = '';
      return res.json({ 'message': 'token not verified', 'error': err });
    }
  }


  function decodeIDTokenForLogin(req, res, next) {
    if (req.body.blahblah === 'blahblah') {
      functions.logger.log("coldstart");
      return res.json('coldstart')
    }
    functions.logger.log(req.path);
    return next();
  }

module.exports = {
    createKeywords,
    decodeIDToken,
    decodeIDTokenForLogin
    
}