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
    name: "who",
    message: "burn tokens from",
    default: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
  },
  {
    type: 'input',
    name: 'amount',
    message: "Input amount",
    default: "1"
  },
  {
      type: 'input',
      name: 'admin',
      message: 'admin for the asset',
      default: '//Alice' 
  }
];

const burn = async () => {
  const {id, who, amount, admin} = await inquirer.prompt(question)
  const adjustedAmount = Number(amount) * 1e12
  console.log({id, who, adjustedAmount, admin})
  const api = await getApi();
  const sender = getKeypair(admin);
  const tx = api.tx.assets
      .burn(Number(id), who, adjustedAmount)
  await signAndSend(tx, api, sender)  
};

module.exports = {
  burn,
};
