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
	type: 'input',
	name: 'admin',
	message: 'admin for the asset',
	default: '//Alice'
}
];

const clearMetadata = async () => {
  const {id, admin} = await inquirer.prompt(question)
  const api = await getApi();
  const sender = await getKeypair(admin);
  const tx = api.tx.assets
      .clearMetadata(Number(id))
  await signAndSend(tx, api, sender)
};

module.exports = {
	clearMetadata,
};
