const { createAsset } = require("./palletCalls/createAsset");
const { mint } = require("./palletCalls/mint");
const { burn } = require("./palletCalls/burn");
const {assetDetails} =require('./palletCalls/assetDetails')
const {accountDetails} =require('./palletCalls/accountDetails')

module.exports = {
    createAsset,
    mint,
    assetDetails,
    accountDetails,
    burn
}