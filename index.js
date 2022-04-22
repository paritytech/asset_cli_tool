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
  approveMultisigTx,
  transferNative,
  nativeBalance,
  batchBurn,
} = require("./blockchainServices");
const inquirer = require("inquirer");
const {
  Calls,
} = require("./blockchainServices/palletCalls/helpers/blockchainCalls");
const { getLedgerAddress } = require("./blockchainServices/setup");

const choices = [
  "Create Asset",
  "Mint",
  "Burn",
  "Batch Burn",
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
  "Transfer Native",
  "Native Balance",
  "Display Ledger Address",
];

const networks = ["Statemine (Kusama)", "Statemint (Polkadot)", "local"];

const network = {
  type: "list",
  name: "chosenNetwork",
  message: "Select Network",
  pageSize: choices.length,
  choices: networks,
};

const intro = {
  type: "list",
  name: "action",
  message: "Select Action",
  pageSize: choices.length,
  choices: choices,
};

const main = async () => {
  intro.pageSize =
    intro.choices.length < process.stdout.rows
      ? intro.choices.length
      : process.stdout.rows - 2;
  const { chosenNetwork } = await inquirer.prompt(network);
  handleNetwork(chosenNetwork);
  const { action } = await inquirer.prompt(intro);
  const calls = new Calls();
  switch (action) {
    case "Create Asset":
      await createAsset(calls);
      break;
    case "Mint":
      await mint(calls);
      break;
    case "Burn":
      await burn(calls);
      break;
    case "Batch Burn":
      await batchBurn(calls);
      break;
    case "Transfer":
      await transfer(calls);
      break;
    case "Force Transfer":
      await forceTransfer(calls);
      break;
    case "Transfer Keep Alive":
      await transferKeepAlive(calls);
      break;
    case "Approve Transfer":
      await approveTransfer(calls);
      break;
    case "Cancel Approval":
      await cancelApproval(calls);
      break;
    case "Transfer Approved":
      await transferApproved(calls);
      break;
    case "Freeze":
      await freeze(calls);
      break;
    case "Thaw":
      await thaw(calls);
      break;
    case "Freeze Asset":
      await freezeAsset(calls);
      break;
    case "Thaw Asset":
      await thawAsset(calls);
      break;
    case "Set Team":
      await setTeam(calls);
      break;
    case "Transfer Ownership":
      await transferOwnership(calls);
      break;
    case "Destroy":
      await destroy(calls);
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
      await setMetadata(calls);
      break;
    case "Clear Metadata":
      await clearMetadata(calls);
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
    case "Transfer Native":
      await transferNative(calls);
      break;
    case "Native Balance":
      await nativeBalance(calls);
      break;
    case "Display Ledger Address":
      console.log(await getLedgerAddress());
      break;
    default:
      throw new Error("invalid choice");
  }
  main();
};

const handleNetwork = (chosenNetwork) => {
  let setNetwork = {
    name: "",
    endpoint: "",
  };
  switch (chosenNetwork) {
    case networks[0]:
      setNetwork.endpoint = "wss://statemine-rpc.polkadot.io";
      setNetwork.name = "statemine";
      break;
    case networks[1]:
      setNetwork.endpoint = "wss://statemint-rpc.polkadot.io";
      setNetwork.name = "statemint";
      break;
    case networks[2]:
      setNetwork.endpoint = "ws://localhost:9944";
      setNetwork.name = "local";
      break;
  }
  global.network = setNetwork;
};

main();
