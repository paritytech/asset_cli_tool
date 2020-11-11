const { getKeypair, getApi, signAndSend } = require("../setup");
const inquirer = require("inquirer");

const question = [
  {
    type: "input",
    name: "id",
    message: "input asset id",
  },
  {
    type: "input",
    name: "admin",
    message: "input admin mnemonic",
    default: "//Alice",
  },
  {
    type: "input",
    name: "maxZombies",
    message: "Input max zombies",
    default: "100",
  },
  {
    type: "input",
    name: "minBalance",
    message: "Input min_balance",
    default: "1",
  },
];

const createAsset = async () => {
  const { id, admin, maxZombies, minBalance } = await inquirer.prompt(question);
  console.log("sending transaction");
  const api = await getApi();
  const sender = getKeypair(admin);
  const tx = api.tx.assets
    .create(Number(id), sender.address, Number(maxZombies), Number(minBalance))
  await signAndSend(tx, api, sender)
};

module.exports = {
  createAsset,
};
