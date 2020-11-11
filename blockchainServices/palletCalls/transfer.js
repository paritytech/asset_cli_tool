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
      name: 'from',
      message: 'sending from mnemonic',
      default: '//Alice' 
  },
  {
    type: "input",
    name: "to",
    message: "send to address",
    default: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
  },
  {
    type: 'input',
    name: 'amount',
    message: "Input amount (will be multiplied by 1e12)",
    default: "1"
  },
];

const transfer = async () => {
  const {id, to, amount, from} = await inquirer.prompt(question)
  const adjustedAmount = Number(amount) * 1e12
  console.log({id, to, from, adjustedAmount})
  const api = await getApi();
  const sender = getKeypair(from);
  const tx = api.tx.assets
      .transfer(Number(id), to, adjustedAmount)
  await signAndSend(tx, api, sender)  
};

module.exports = {
  transfer,
};
