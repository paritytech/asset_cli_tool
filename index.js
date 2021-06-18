const {
  createAsset,
  mint,
  burn,
  assetDetails,
  accountDetails,
  approvals,
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
  setTeam,
  transferOwnership,
  setMetadata,
  clearMetadata,
  assetMetadata,
  createMultisig,
  createMultisigTx,
  approveMultisigTx
} = require("./blockchainServices");
const inquirer = require("inquirer");
const { Calls } = require("./blockchainServices/palletCalls/helpers/blockchainCalls");

const intro = {
  type: "list",
  name: "action",
  message: "Select Action",
  choices: [
    "Create Asset",
    "Mint",
    "Burn",
    "Transfer",
    "Force Transfer",
    "Transfer Keep Alive",
    "Approve Transfer",
    "Cancel Approval",
    "Transfer Approved",
    "Freeze",
    "Thaw",
    "Freeze Asset",
    "Thaw Asset",
    "Set Team",
    "Transfer Ownership",
    "Destroy",
    "Asset Details",
    "Account Details",
    "Approvals Details",
    "Set Metadata",
    "Clear Metadata",
    "Asset Metadata",
    "Create Multisig",
    "Create Multisig Tx",
    "Approve Multisig Tx",
  ],
};

const main = async () => {
  const { action } = await inquirer.prompt(intro);
  const calls = new Calls()
  switch (action) {
    case "Create Asset":
      await createAsset();
      break;
    case "Mint":
      await mint(calls);
      break;
    case "Burn":
      await burn();
      break;
    case "Transfer":
      await transfer();
      break;
    case "Force Transfer":
      await forceTransfer();
      break;
    case "Transfer Keep Alive":
      await transferKeepAlive();
      break;
    case "Approve Transfer":
      await approveTransfer();
      break;
    case "Cancel Approval":
      await cancelApproval();
      break;
    case "Transfer Approved":
      await transferApproved();
      break;
    case "Freeze":
      await freeze();
      break;
    case "Thaw":
      await thaw();
      break;
    case "Freeze Asset":
      await freezeAsset();
      break;
    case "Thaw Asset":
      await thawAsset();
      break;
    case "Set Team":
      await setTeam();
      break;
    case "Transfer Ownership":
      await transferOwnership();
      break;
    case "Destroy":
      await destroy();
      break;
    case "Asset Details":
      await assetDetails();
      break;
    case "Account Details":
      await accountDetails();
      break;
    case "Approvals Details":
      await approvals();
      break;
    case "Set Metadata":
      await setMetadata();
      break;
    case "Clear Metadata":
      await clearMetadata();
      break;
    case "Asset Metadata":
      await assetMetadata();
      break;
    case "Create Multisig":
      await createMultisig();
      break;
    case "Create Multisig Tx":
      await createMultisigTx(calls);
      break;
    case "Approve Multisig Tx":
      await approveMultisigTx(calls);
      break;
    default:
      throw new Error("invalid choice");
  }
};

main();
