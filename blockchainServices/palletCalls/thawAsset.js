const { getKeypair, getApi, signAndSend } = require("../setup");
const inquirer = require("inquirer");

const question = [
  {
    type: "input",
    name: "id",
    message: "input asset id to freeze",
    default: "1",
  },
  {
    type: "input",
    name: "thawer",
    message: "input thawer mnemonic",
    default: "//Alice",
  },
];

const thawAsset = async (calls) => {
  const { id, thawer } = await inquirer.prompt(question);
  const api = await getApi();
  const sender = getKeypair(thawer);
  const tx = await calls.thawAsset(api, [id]);
  await signAndSend(tx, api, sender);
};

module.exports = {
  thawAsset,
};
