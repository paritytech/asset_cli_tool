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
    message: 'Input who to thaw',
    default: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
  },
  {
    type: 'input',
    name: 'admin',
    message: 'input admin mnemonic (type ledger to use Ledger Generic App, type migration to use Ledger Migration App)',
    default: '//Alice',
  },
];

const thaw = async (calls) => {
  const { id, admin, who } = await inquirer.prompt(question);
  const api = await getApi();
  const tx = await calls.thaw(api, [id, who]);
  if (admin === 'ledger') {
    await ledgerSignAndSend(tx, api);
  } else if (admin === 'migration') {
    await ledgerSignAndSend(tx, api, true);
  } else {
    const sender = getKeypair(admin);
    await signAndSend(tx, api, sender);
  }
};

module.exports = {
  thaw,
};
