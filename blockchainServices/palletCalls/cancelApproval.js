const { getKeypair, getApi, signAndSend, ledgerSignAndSend } = require('../setup');
const inquirer = require('inquirer');

const question = [
  {
    type: 'input',
    name: 'id',
    message: 'input asset id',
    default: '1'
  },
  {
    type: 'input',
    name: 'from',
    message: 'sending from mnemonic (type ledger to use Ledger Generic App, type migration to use Ledger Migration App)',
    default: '//Bob' 
},
  {
    type: 'input',
    name: 'delegate',
    message: 'delegate to address',
    default: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
  },
];

const cancelApproval = async (calls) => {
  const {id, delegate, from} = await inquirer.prompt(question)
  const api = await getApi();
  const tx = await calls.cancelApproval(api, [id, delegate])
  if (from === 'ledger') {
    await ledgerSignAndSend(tx, api)
  } else if (from === 'migration') {
    await ledgerSignAndSend(tx, api, true)
  } else {
    const sender = getKeypair(from);
    await signAndSend(tx, api, sender)
  }};

module.exports = {
  cancelApproval,
};
