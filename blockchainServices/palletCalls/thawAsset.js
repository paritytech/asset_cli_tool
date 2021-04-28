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
    name: "thawer",
    message: "input thawer mnemonic",
    default: "//Alice",
  },
];

const thawAsset = async () => {
  const { id, thawer } = await inquirer.prompt(question);
  console.log({id, thawer})
  const api = await getApi();
  const sender = getKeypair(thawer);
  const tx = api.tx.assets
    .thawAsset(Number(id))
  await signAndSend(tx, api, sender)
};

module.exports = {
  thawAsset,
};
