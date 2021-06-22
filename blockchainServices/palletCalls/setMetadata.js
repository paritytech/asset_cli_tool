const { getKeypair, getApi, signAndSend } = require("../setup");
const inquirer = require("inquirer");

const question = [
  {
    type: "input",
    name: "id",
    message: "input asset id",
    default: '1'
  },
  {
    type: "input",
    name: "name",
    message: "Token name",
    default: "test"
  },
  {
    type: 'input',
    name: 'symbol',
    message: "Token symbol",
    default: "test"
  },
  {
      type: 'input',
      name: 'decimals',
      message: 'Token decimals',
      default: '12'
  },
  {
	type: 'input',
	name: 'admin',
	message: 'admin for the asset',
	default: '//Alice'
}
];

const setMetadata = async () => {
  const {id, admin, name, symbol, decimals} = await inquirer.prompt(question)
  const api = await getApi();
  const sender = await getKeypair(admin);
  const tx = api.tx.assets
      .setMetadata(Number(id), name, symbol, decimals)
  await signAndSend(tx, api, sender)
};

module.exports = {
	setMetadata,
};