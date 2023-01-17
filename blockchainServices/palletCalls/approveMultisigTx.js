const inquirer = require("inquirer");
const {
  getKeypair,
  getApi,
  signAndSend,
  ledgerSignAndSend,
} = require("../setup");
const { blake2AsHex, blake2AsU8a } = require("@polkadot/util-crypto");
const { multisigConfig } = require("./helpers/configHelpers");

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
  const weight = { refTime: '1096433000', proofSize: '0' };
  // weight is hardcoded until payment info api added to statemine
  // const paymentInfo = await preppedTx.paymentInfo(sender)
  // console.log({paymentInfo: paymentInfo.toString()})
  console.log("MULTISIG ACCOUNT---", multisigAccount);
  console.log("CALL IS", txToSend);
  const multisigCall = await api.query.multisig.multisigs(
    multisigAccount,
    blake2AsHex(txToSend.toHex())
  );
  console.log("MULTISIG CALL--", multisigCall.toJSON())
  console.log({
    threshold,
    otherSignatories: otherSignatories,
    when: multisigCall.when,
    txToSend: txToSend.toHuman(),
    weight,
  });

  const tx = api.tx.multisig.asMulti(
    threshold,
    otherSignatories,
    multisigCall.when,
    txToSend.toHex(),
    // false,
    weight,
  );
  if (admin === "ledger") {
    await ledgerSignAndSend(tx, api);
  } else {
    await signAndSend(tx, api, sender);
  }
};

module.exports = {
  approveMultisigTx,
};
