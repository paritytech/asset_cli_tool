const inquirer = require('inquirer');
const {
  getApi,
  signAndSend,
  ledgerSignAndSend,
} = require("../setup");
const { blake2AsHex, blake2AsU8a } = require("@polkadot/util-crypto");
const { multisigConfig } = require("./helpers/configHelpers");
let config;
try {
  config = require("../../multisigConfig.json");
} catch (e) {}

const question = [
  {
    type: 'input',
    name: 'multisigAccount',
    message: 'input multisig account',
    default: '5DjYJStmdZ2rcqXbXGX7TW85JsrW6uG4y9MUcLq2BoPMpRA7',
  },
  {
    type: 'input',
    name: 'call',
    message: 'the function to call',
    default: 'mint',
  },
  {
    type: "input",
    name: "promptArguments",
    message: "an array of arguments",
    default: ["1", "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", "1"],

  },
  {
    type: 'input',
    name: 'admin',
    message: 'sender of the transaction (type ledger to use Ledger Generic App, type migration to use Ledger Migration App)',
    default: '//Bob',
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
      ["5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y", "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"],
  },
];

const question2 = [
  {
    type: "input",
    name: "promptArguments",
    message: "arguments not set, set now",
    default: ["1", "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty", "1"],

  },
];

const approveMultisigTx = async (calls) => {
  console.log({ config });
  let multisigAccount,
    call,
    promptArguments,
    threshold,
    otherSignatories,
    sender,
    admin;
  ({
    multisigAccount,
    call,
    promptArguments,
    threshold,
    otherSignatories,
    admin,
  } = !config
    ? await inquirer.prompt(question)
    : await inquirer.prompt([
        {
          type: "confirm",
          message: "check over config, hit enter to continue",
          name: "confirm",
        },
      ]));

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

  if (!promptArguments) {
    ({ promptArguments } = await inquirer.prompt(question2))
  }

  console.log("config overridden parameters", {

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
  // aliasing weight as maxWeight
  const { weight: maxWeight } = await api.call.transactionPaymentApi.queryInfo(txToSend, txToSend.toU8a().length);
  const multisigCall = await api.query.multisig.multisigs(
    multisigAccount,
    blake2AsHex(txToSend.toHex())
  );

  console.log({
    threshold,
    otherSignatories: otherSignatories,
    when: multisigCall.unwrap().toJSON().when,
    txToSend: txToSend.toHuman(),
    maxWeight: maxWeight.toJSON(),
  });

  const tx = api.tx.multisig.asMulti(
    threshold,
    otherSignatories,
    multisigCall.unwrap().toJSON().when,
    txToSend.toHex(),
    maxWeight,
  );
  if (admin === 'ledger') {
    await ledgerSignAndSend(tx, api);
  } else if (admin === 'migration') {
    await ledgerSignAndSend(tx, api, true);
  } else {
    sender = getKeypair(admin);
    await signAndSend(tx, api, sender);
  }
};

module.exports = {
  approveMultisigTx,
};
