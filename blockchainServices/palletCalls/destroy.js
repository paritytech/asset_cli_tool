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
];

const destroy = async (calls) => {
  const { id, admin } = await inquirer.prompt(question);
  const api = await getApi();
  const sender = getKeypair(admin);
  const tx = await calls.destroy(api, [id])
  await signAndSend(tx, api, sender)
};

module.exports = {
  destroy,
};
