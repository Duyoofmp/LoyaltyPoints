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

async function decodeIDTokenHeader(req, res, next) {
  if (req.body.blahblah === 'blahblah') {
    functions.logger.log("coldstart");
    return res.json('coldstart')
  }
  functions.logger.log(req.path);

  functions.logger.log(req.get('Authorization'));
  functions.logger.log(req.body);
  let encoded = req.get('Authorization');
  if (encoded === undefined || encoded === null) {
    res.status(401).json({ "message": "token not verified" });
  } else {
    const idToken = encoded.replace('Bearer ', '');
    console.log(idToken);

    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      console.log(decodedToken.uid);
      req.body.UserId = decodedToken.uid;
      delete req.body.Token;
      return next();
    } catch (err) {
      console.log(err);
      res.status(401).json({ "message": "token not verified", "error": err });
    }

  }
  return console.log('Decode Completed');
}

async function checkarray(collectionName, docName, array, element) {
  let flag = 0;
  const data = await db.collection(collectionName).doc(docName).get();
  const dt = data.data();
  console.log(dt.StoreAdminIds)
  for (let i = 0; i < dt.StoreAdminIds.length; i++) {
    if (dt.StoreAdminIds[i] === element)
      flag = 1
  }
  if (flag !== 1) {
    return true
  } else {
    return false
  }
}

async function generateOTP() {

  let digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

async function SendOtp(DocId) {
  const user = await db.collection("Users").doc(DocId).get();
  const OTP = await generateOTP();
  await db.collection("Users").doc(DocId).update({
    OTP: OTP
  })
  const PhoneNumber = String(user.data().CountryCode) + String(user.data().PhoneNumber)
  await db.collection("messages").add({
    to: PhoneNumber,
    body: `Your Verification Code is : ${OTP}`
  })
}

module.exports = {
  createKeywords,
  decodeIDToken,
  decodeIDTokenForLogin,
  decodeIDTokenHeader,
  checkarray,
  SendOtp

}