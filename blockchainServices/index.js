const { createAsset } = require("./palletCalls/createAsset");
const { mint } = require("./palletCalls/mint");
const { burn } = require("./palletCalls/burn");
const { batchBurn } = require("./palletCalls/batchBurn");
const { transfer } = require("./palletCalls/transfer");
const { forceTransfer } = require("./palletCalls/forceTransfer");
const { transferKeepAlive } = require("./palletCalls/transferKeepAlive");
const { approveTransfer } = require("./palletCalls/approveTransfer");
const { cancelApproval } = require("./palletCalls/cancelApproval");
const { transferApproved } = require("./palletCalls/transferApproved");
const { freeze } = require("./palletCalls/freeze");
const { thaw } = require("./palletCalls/thaw");
const { freezeAsset } = require("./palletCalls/freezeAsset");
const { thawAsset } = require("./palletCalls/thawAsset");
const { destroy } = require("./palletCalls/destroy");
const { setTeam } = require("./palletCalls/setTeam");
const { transferOwnership } = require("./palletCalls/transferOwnership");
const { assetDetails } = require("./palletCalls/assetDetails");
const { accountDetails } = require("./palletCalls/accountDetails");
const { approvals } = require("./palletCalls/approvals");
const { setMetadata } = require("./palletCalls/setMetadata");
const { clearMetadata } = require("./palletCalls/clearMetadata");
const { assetMetadata } = require("./palletCalls/assetMetadata");
const { createMultisig } = require("./palletCalls/createMultisig");
const { createMultisigTx } = require("./palletCalls/createMultisigTx");
const { approveMultisigTx } = require("./palletCalls/approveMultisigTx");
const { transferNative } = require("./palletCalls/transferNative");
const { nativeBalance } = require("./palletCalls/nativeBalance");
const { block } = require("./palletCalls/block")
const { touchOther } = require("./palletCalls/touchOther")

module.exports = {
  createAsset,
  mint,
  assetDetails,
  accountDetails,
  approvals,
  burn,
  batchBurn,
  freeze,
  thaw,
  freezeAsset,
  thawAsset,
  transfer,
  forceTransfer,
  transferKeepAlive,
  approveTransfer,
  cancelApproval,
  transferApproved,
  destroy,
  block,
  touchOther,
  setTeam,
  transferOwnership,
  setMetadata,
  clearMetadata,
  assetMetadata,
  createMultisig,
  createMultisigTx,
  approveMultisigTx,
  transferNative,
  nativeBalance
};
