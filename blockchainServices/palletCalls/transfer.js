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
    name: 'from',
    message: 'sending from mnemonic (type ledger to use Ledger Generic App, type migration to use Ledger Migration App)',
    default: '//Alice',
  },
  {
    type: 'input',
    name: 'to',
    message: 'send to address',
    default: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
  },
  {
    type: 'input',
    name: 'amount',
    message: 'Input amount (will be multiplied by decimals)',
    default: '1',
  },
];

const transfer = async (calls) => {
  const { id, to, amount, from } = await inquirer.prompt(question);
  const api = await getApi();
  const tx = await calls.transfer(api, [id, to, amount]);
  if (from === 'ledger') {
    await ledgerSignAndSend(tx, api);
  } else if (from === 'migration') {
    await ledgerSignAndSend(tx, api, true);
  } else {
    const sender = getKeypair(from);
    await signAndSend(tx, api, sender);
  }
};

module.exports = {
  transfer,
};
