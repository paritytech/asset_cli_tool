const { createAsset, mint, assetDetails, accountDetails } = require("./blockchainServices");
const inquirer = require("inquirer");

const intro = {
  type: "list",
  name: "action",
  message: "Select Action",
  choices: ["Create Asset", "Mint", "Asset Details", "Account Details"],
};

const main = async () => {
  const { action } = await inquirer.prompt(intro);
  console.log(action);
  switch (action) {
    case "Create Asset":
      await createAsset();
      break;
    case "Mint":
      await mint();
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
