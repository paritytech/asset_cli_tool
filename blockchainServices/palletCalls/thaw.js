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
    message: "Input who to thaw",
    default: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
  },
  {
    type: "input",
    name: "admin",
    message: "input admin mnemonic",
    default: "//Alice",
  },
];

const thaw = async () => {
  const { id, admin, who } = await inquirer.prompt(question);
  console.log("sending transaction");
  const api = await getApi();
  const sender = getKeypair(admin);
  const tx = api.tx.assets
    .thaw(Number(id), who)
  await signAndSend(tx, api, sender)
};

module.exports = {
  thaw,
};
