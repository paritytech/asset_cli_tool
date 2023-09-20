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
    message: 'input asset id to freeze',
    default: '1',
  },
  {
    type: 'input',
    name: 'freezer',
    message: 'input freezer mnemonic (type ledger to use Ledger)',
    default: '//Alice',
  },
];

const freezeAsset = async (calls) => {
  const { id, freezer } = await inquirer.prompt(question);
  const api = await getApi();
  const tx = await calls.freezeAsset(api, [id]);
  if (freezer === 'ledger') {
    await ledgerSignAndSend(tx, api);
  } else {
    const sender = getKeypair(freezer);
    await signAndSend(tx, api, sender);
  }
};

module.exports = {
  freezeAsset,
};
