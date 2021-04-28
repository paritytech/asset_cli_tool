const { getKeypair, getApi, signAndSend } = require("../setup");
const inquirer = require("inquirer");

const question = [
  {
    type: "input",
    name: "id",
    message: "input asset id to freeze",
    default: "1"
  },
  {
    type: "input",
    name: "freezer",
    message: "input freezer mnemonic",
    default: "//Alice",
  },
];

const freezeAsset = async () => {
  const { id, freezer } = await inquirer.prompt(question);
  console.log({id, freezer})
  const api = await getApi();
  const sender = getKeypair(freezer);
  const tx = api.tx.assets
    .freezeAsset(Number(id))
  await signAndSend(tx, api, sender)
};

module.exports = {
  freezeAsset,
};
