const { getKeypair, getApi, signAndSend, ledgerSignAndSend } = require('../setup');
const inquirer = require('inquirer');

const question = [
  {
    type: 'input',
    name: 'id',
    message: 'input asset id',
    default: '1',
  },
  {
    type: 'input',
    name: 'admin',
    message: 'admin account (type ledger to use Ledger Generic App, type migration to use Ledger Migration App)',
    default: '//Alice',
  },
  {
    type: 'input',
    name: 'source',
    message: 'send from address',
    default: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
  },
  {
    type: 'input',
    name: 'dest',
    message: 'send to address',
    default: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
  },
  {
    type: 'input',
    name: 'amount',
    message: 'Input amount (will be multiplied by decimals)',
    default: '1',
  },
];

const forceTransfer = async (calls) => {
  const { id, dest, amount, source, admin } = await inquirer.prompt(question);
  const api = await getApi();
  const tx = await calls.forceTransfer(api, [id, source, dest, amount]);
  if (admin === 'ledger') {
    await ledgerSignAndSend(tx, api)
  } else if (admin === 'migration') {
    await ledgerSignAndSend(tx, api, true)
  } else {
    const sender = getKeypair(admin);
    await signAndSend(tx, api, sender)
  }};

module.exports = {
  forceTransfer,
};
