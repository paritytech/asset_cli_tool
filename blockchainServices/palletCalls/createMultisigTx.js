const inquirer = require('inquirer');
const {
  getApi,
  signAndSend,
  ledgerSignAndSend,
} = require('../setup');
const { multisigConfig } = require('./helpers/configHelpers');

const question = [
  {
    type: 'input',
    name: 'multisigAccount',
    message: 'input multisig account',
    default: 'DTZvNZsZYugGQFQfA6tytW5HxDPeZ5ZsdcFAesauutHniUW',
  },
  {
    type: 'input',
    name: 'call',
    message: 'the function to call',
    default: 'mint',
  },
  {
    type: 'input',
    name: 'promptArguments',
    message: 'an array of arguments',
    default: "['1', '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY', '1']",
  },
  {
    type: 'input',
    name: 'admin',
    message: 'sender of the transaction (type ledger to use Ledger)',
    default: '//Alice',
  },
  {
    type: 'input',
    name: 'threshold',
    message: 'm of n',
    default: '2',
  },
  {
    type: 'input',
    name: 'otherSignatories',
    message: 'other signatories array',
    default:
      "['5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty', '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y']",
  },
];

const createMultisigTx = async (calls) => {
  let {
    multisigAccount,
    call,
    promptArguments,
    threshold,
    otherSignatories,
    admin,
  } = await inquirer.prompt(question);
  ({
    multisigAccount,
    call,
    promptArguments,
    threshold,
    otherSignatories,
    sender,
	admin, 
  } = await multisigConfig({
    multisigAccount,
    promptArguments,
    threshold,
    otherSignatories,
    call,
    admin,
  }));
  console.log('config overridden parameters', {
    multisigAccount,
    call,
    promptArguments,
    threshold,
    otherSignatories,
    admin,
  });
  const api = await getApi();
  const preppedTx = await calls[`${call}`](api, promptArguments);
  const txToSend = api.createType('Call', preppedTx);
  const { weight: maxWeight } = await api.call.transactionPaymentApi.queryInfo(txToSend, txToSend.toU8a().length);
  const maybeTimepoint = null;
  console.log({ 
    threshold,
    otherSignatories: otherSignatories,
    txToSend: txToSend.toHuman(),
    maxWeight,
  });
  const tx = api.tx.multisig.asMulti(
    threshold,
    otherSignatories,
    maybeTimepoint,
    txToSend.toHex(),
    maxWeight.toJSON(),
  );
  if (admin === 'ledger') {
    await ledgerSignAndSend(tx, api);
  } else {
    await signAndSend(tx, api, sender);
  }
};

module.exports = {
  createMultisigTx,
};
