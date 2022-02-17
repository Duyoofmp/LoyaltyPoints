const functions = require('firebase-functions');
const admin = require('firebase-admin');
const dataHandling = require("../../functions");

async function ReadStoreAdmins(req, res) {
    let data = [];
    const user = await dataHandling.Read("Users", req.body.DocId);
    const StoreAdminIds = user.StoreAdminIds;
    for (let i = 0; i < StoreAdminIds.length; i++) {
        const StoreAdminId = StoreAdminIds[i];
        const dt = await dataHandling.Read("StoreAdmins", StoreAdminId)
        const query = await dataHandling.Read(`Users/${req.body.DocId}/StoreAdmins`, StoreAdminId)
        data.push({ StoreAdminName: dt.StoreAdminName, PhoneNumber: dt.PhoneNumber, DocId: dt.DocId, Image: dt.Image, CountryCode: dt.CountryCode, Address: dt.Address, Points: query.Points })
    }
    return res.json(data)
}

async function ShowProfile(req, res) {
    const user = await dataHandling.Read(`Users/${req.body.DocId}/StoreAdmins`, req.body.StoreAdminId);
    const Banners = await dataHandling.Read("Banners", undefined, undefined, undefined, 1000, ["StoreAdminId", "==", req.body.StoreAdminId], ["desc"])
    return res.json({
        Banners,
        Points: user.Points
    })
}

async function ReadSuperBanners(req,res){
    const data = await dataHandling.Read("Banners",req.body.DocId,req.body.index,req.body.Keyword,1000,["SuperAdmin","==",true],["desc"] )
    return res.json(data)
}

module.exports = {
    ReadStoreAdmins,
    ShowProfile,
    ReadSuperBanners
}