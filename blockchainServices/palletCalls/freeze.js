const {
  getKeypair,
  getApi,
  signAndSend,
  ledgerSignAndSend,
} = require('../setup');
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
    name: 'who',
    message: 'input who to freeze',
    default: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
  },
  {
    type: 'input',
    name: 'freezer',
    message: 'input freezer mnemonic (type ledger to use Ledger Generic App, type migration to use Ledger Migration App)',
    default: '//Alice',
  },
];

const freeze = async (calls) => {
  const { id, freezer, who } = await inquirer.prompt(question);
  const api = await getApi();
  const tx = await calls.freeze(api, [id, who]);
  if (freezer === 'ledger') {
    await ledgerSignAndSend(tx, api);
  } else if (freezer === 'migration') {
    await ledgerSignAndSend(tx, api, true);
  } else {
    const sender = getKeypair(freezer);
    await signAndSend(tx, api, sender);
  }
};

module.exports = {
  freeze,
};
