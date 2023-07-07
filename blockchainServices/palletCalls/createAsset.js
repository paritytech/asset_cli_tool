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
    message: "input minimum balance",
    default: "1",
  },
];

const createAsset = async (calls) => {
  const { id, admin, minBalance } = await inquirer.prompt(question);
  const api = await getApi();
  const sender = await getKeypair(admin);
  const tx = await calls.createAsset(api, [id, sender.address, minBalance])
  if (admin === "ledger") {
    await ledgerSignAndSend(tx, api)
  } else {
    const sender = getKeypair(admin);
    await signAndSend(tx, api, sender)
  }
};

module.exports = {
  createAsset,
};
