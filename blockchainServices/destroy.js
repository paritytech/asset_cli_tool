const { getKeypair, getApi } = require("./setup");
const inquirer = require("inquirer");

const question = [
  {
    type: "input",
    name: "id",
    message: "input asset id",
  },
  {
    type: "input",
    name: "admin",
    message: "input admin mnemonic",
    default: "//Alice"
  },
  {
    type: 'input',
    name: 'maxZombies',
    message: "Input max zombies",
    default: "100"
  },
  {
    type: 'input',
    name: 'minBalance',
    message: "Input min_balance",
    default: '0'
  },
];

const createAsset = async () => {
  const {id, admin, maxZombies, minBalance} = await inquirer.prompt(question)
  console.log({id, admin, maxZombies, minBalance})
  const api = await getApi();
  const alice = getKeypair(admin);
  try {
    await api.tx.assets
      .destroy(Number(id), alice.address, Number(maxZombies), Number(minBalance))
      .signAndSend(alice);
  } catch (e) {
    console.log(e.message);
  }
};

module.exports = {
  createAsset,
};
