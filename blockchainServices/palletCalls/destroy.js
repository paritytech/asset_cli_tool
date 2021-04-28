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

const destroy = async () => {
  const { id, admin, witness } = await inquirer.prompt(question);
  const api = await getApi();
  const assetInfo = await api.query.assets.asset(Number(id))
  console.log({id, admin, assetInfo});
  const sender = getKeypair(admin);
  const tx = api.tx.assets
    .destroy(Number(id), assetInfo)
  await signAndSend(tx, api, sender)
};

module.exports = {
  destroy,
};
