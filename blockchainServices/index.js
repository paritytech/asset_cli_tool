const { createAsset } = require("./palletCalls/createAsset");
const { mint } = require("./palletCalls/mint");
const { burn } = require("./palletCalls/burn");
const { transfer } = require("./palletCalls/transfer");
const { forceTransfer } = require("./palletCalls/forceTransfer");
const { freeze } = require("./palletCalls/freeze");
const { thaw } = require("./palletCalls/thaw");
const { destroy } = require("./palletCalls/destroy");
const { setTeam } = require("./palletCalls/setTeam");
const {assetDetails} =require('./palletCalls/assetDetails')
const {accountDetails} =require('./palletCalls/accountDetails')

module.exports = {
    createAsset,
    mint,
    assetDetails,
    accountDetails,
    burn,
    freeze,
    thaw,
    transfer,
    forceTransfer,
    destroy,
    setTeam
}