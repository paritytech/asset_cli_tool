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
    name: "witness",
    message: "Input zombie witness",
    default: "100",
  },
];

const destroy = async () => {
  const { id, admin, witness } = await inquirer.prompt(question);
  console.log({id, admin, witness});
  const api = await getApi();
  const sender = getKeypair(admin);
  const tx = api.tx.assets
    .destroy(Number(id), Number(witness))
  await signAndSend(tx, api, sender)
};

module.exports = {
  destroy,
};
