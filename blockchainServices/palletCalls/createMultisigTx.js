const inquirer = require("inquirer");
const {
  getKeypair,
  getApi,
  signAndSend,
  ledgerSignAndSend,
} = require("../setup");
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
    default: "DTZvNZsZYugGQFQfA6tytW5HxDPeZ5ZsdcFAesauutHniUW",
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
    default: '["1", "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty", "1"]',
  },
  {
    type: "input",
    name: "admin",
    message: "sender of the transaction type ledger for ledger",
    default: "//Alice",
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
      '["5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty", "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y"]',
  },
];

const createMultisigTx = async (calls) => {
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
  console.log({preppedTx})
  const txToSend = api.createType("Call", preppedTx);

  console.log({
    threshold,
    otherSignatories: otherSignatories,
    txToSend: txToSend.toHuman(),
    weight: 0,
  });
  const tx = api.tx.multisig.asMulti(
    threshold,
    otherSignatories,
    null,
    txToSend.toHex(),
    true,
    0
  );
  if (admin === "ledger") {
    await ledgerSignAndSend(tx, api);
  } else {
    sender = getKeypair(admin);
    await signAndSend(tx, api, sender);
  }
};

module.exports = {
  createMultisigTx,
};
