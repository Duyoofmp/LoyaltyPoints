const functions = require('firebase-functions');
const admin = require('firebase-admin');
const dataHandling = require("../functions");

async function Create(req, res) {
  req.body.index = Date.now()
  await dataHandling.Create(`StoreAdmins/${req.body.StoreAdminId}/Category`, req.body)
  return res.json(true)
}
async function Update(req, res) {
  req.body.index = Date.now()
  await dataHandling.Update(`StoreAdmins/${req.body.StoreAdminId}/Category`, req.body, req.body.DocId)
  return res.json(true)
}
async function Delete(req, res) {
  await dataHandling.Delete(`StoreAdmins/${req.body.StoreAdminId}/Category`, req.body.DocId)
  return res.json(true)
}

async function Read(req, res) {
  const data = await dataHandling.Read(`StoreAdmins/${req.body.StoreAdminId}/Category`, req.body.DocId, req.body.index, req.body.Keyword);
 return res.json(data)
}



module.exports = {
  Create,
  Update,
  Delete,
  Read
}


