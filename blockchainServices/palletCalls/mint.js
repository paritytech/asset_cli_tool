const { getKeypair, getApi, signAndSend } = require("../setup");
const inquirer = require("inquirer");

const question = [
  {
    type: "input",
    name: "id",
    message: "input asset id",
  },
  {
    type: "input",
    name: "to",
    message: "send to address",
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

const mint = async () => {
  const {id, to, amount, admin} = await inquirer.prompt(question)
  const adjustedAmount = Number(amount) * 1e12
  console.log({id, to, adjustedAmount})
  const api = await getApi();
  const sender = getKeypair(admin);
  const tx = api.tx.assets
      .mint(Number(id), to, adjustedAmount)
  await signAndSend(tx, api, sender)  
};

module.exports = {
  mint,
};
