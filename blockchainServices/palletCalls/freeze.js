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
    name: "who",
    message: "Input who to freeze",
    default: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
  },
  {
    type: "input",
    name: "freezer",
    message: "input freezer mnemonic",
    default: "//Alice",
  },
];

const freeze = async (calls) => {
  const { id, freezer, who } = await inquirer.prompt(question);
  const api = await getApi();
  const sender = getKeypair(freezer);
  const tx = await calls.freeze(api, [id, who])
  await signAndSend(tx, api, sender)
};

module.exports = {
  freeze,
};
