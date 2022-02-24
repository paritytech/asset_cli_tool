const inquirer = require("inquirer");
const {
  getKeypair,
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
    type: "input",
    name: "multisigAccount",
    message: "input multisig account",
    default: "5DjYJStmdZ2rcqXbXGX7TW85JsrW6uG4y9MUcLq2BoPMpRA7",
  },
  {
    type: "input",
    name: "call",
    message: "the function to call",
    default: "mint",
  },
  {
    type: "input",
    name: "promptArguments",
    message: "an array of arguments",
    default: '["1", "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", "1"]',
  },
  {
    type: "input",
    name: "admin",
    message: "sender of the transaction type ledger for ledger",
    default: "//Bob",
  },
  {
    type: "input",
    name: "threshold",
    message: "m of n",
    default: "2",
  },
  {
    type: "input",
    name: "otherSignatories",
    message: "other signatories array",
    default:
      '["5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y", "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"]',
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

  promptArguments = promptArguments ? JSON.parse(promptArguments) : null;
  otherSignatories = otherSignatories ? JSON.parse(otherSignatories) : null;
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
  const txToSend = api.createType("Call", preppedTx);
  // weight is hardcoded until payment info api added to statemine
  // const paymentInfo = await preppedTx.paymentInfo(sender)
  // console.log({paymentInfo: paymentInfo.toString()})
  const multisigCall = await api.query.multisig.multisigs(
    multisigAccount,
    blake2AsHex(txToSend.toHex())
  );
  console.log({
    threshold,
    otherSignatories: otherSignatories,
    when: multisigCall.toJSON().when,
    txToSend: txToSend.toHuman(),
    weight: 1096433000,
  });

  const tx = api.tx.multisig.asMulti(
    threshold,
    otherSignatories,
    multisigCall.toJSON().when,
    txToSend.toHex(),
    false,
    1096433000
  );
  if (admin === "ledger") {
    await ledgerSignAndSend(tx, api);
  } else {
    sender = getKeypair(admin);
    await signAndSend(tx, api, sender);
  }
};

module.exports = {
  approveMultisigTx,
};
