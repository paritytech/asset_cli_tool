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
      message: 'admin account',
      default: '//Alice' 
  },
  {
    type: "input",
    name: "from",
    message: "send from address",
    default: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
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
    message: "Input amount (will be multiplied by 1e12)",
    default: "1"
  },
];

const forceTransfer = async () => {
  const {id, to, amount, from, admin} = await inquirer.prompt(question)
  const adjustedAmount = Number(amount) * 1e12
  console.log({id, to, from, admin, adjustedAmount})
  const api = await getApi();
  const sender = getKeypair(admin);
  const tx = api.tx.assets
      .forceTransfer(Number(id), from, to, adjustedAmount)
  await signAndSend(tx, api, sender)  
};

module.exports = {
  forceTransfer,
};
