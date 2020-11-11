const {
  createAsset,
  mint,
  burn,
  assetDetails,
  accountDetails,
  freeze,
  thaw,
  transfer,
  forceTransfer,
  destroy,
  setTeam,
  transferOwnership,
} = require("./blockchainServices");
const inquirer = require("inquirer");

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
    "Freeze",
    "Thaw",
    "Set Team",
    "Transfer Ownership",
    "Destroy",
    "Asset Details",
    "Account Details",
  ],
};

const main = async () => {
  const { action } = await inquirer.prompt(intro);
  switch (action) {
    case "Create Asset":
      await createAsset();
      break;
    case "Mint":
      await mint();
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
    case "Freeze":
      await freeze();
      break;
    case "Thaw":
      await thaw();
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
    default:
      throw new Error("invalid choice");
  }
};

main();
