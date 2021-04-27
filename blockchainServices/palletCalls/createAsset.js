const { getKeypair, getApi, signAndSend } = require("../setup");
const inquirer = require("inquirer");

const question = [
  {
    type: "input",
    name: "id",
    message: "input asset id",
    default: "1"
  },
  {
    type: "input",
    name: "admin",
    message: "input admin mnemonic",
    default: "//Alice",
  },
  {
    type: "input",
    name: "minBalance",
    message: "Input min_balance",
    default: "1",
  },
];

const createAsset = async () => {
  const { id, admin, minBalance } = await inquirer.prompt(question);
  console.log({id, admin, minBalance});
  const api = await getApi();
  const sender = getKeypair(admin);
  const tx = api.tx.assets
    .create(Number(id), sender.address, Number(minBalance))
  await signAndSend(tx, api, sender)
};

module.exports = {
  createAsset,
};
