const { getLedgerAddress, getKeypair } = require("../../setup");

const multisigConfig = async (params) => {
  let {
    multisigAccount,
    call,
    promptArguments,
    threshold,
    otherSignatories,
    admin,
  } = params;

  let config;

  try {
    config = require("../../../multisigConfig.json");
  } catch (e) {}

  if (!config) {
    return params;
  }

  multisigAccount = config.multisigAccount
    ? config.multisigAccount
    : multisigAccount;
  call = config.call ? config.call : call;
  promptArguments = config.arguments
    ? config.arguments
    : promptArguments;
  threshold = config.threshold ? config.threshold : threshold;
  otherSignatories = config.signatories
    ? config.signatories
    : otherSignatories;
  admin = config.ledger ? "ledger" : config.admin;
  const sender = config.ledger ? await getLedgerAddress(config.migration) : getKeypair(admin);
  otherSignatories = otherSignatories.filter((who) => who !== sender.address);
  otherSignatories.sort();
  console.log(
    "using config file",
    multisigAccount,
    call,
    promptArguments,
    threshold,
    otherSignatories,
    sender,
    admin
  );
  return {
    multisigAccount,
    call,
    promptArguments,
    threshold,
    otherSignatories,
    sender,
    admin,
  };
};

module.exports = {
  multisigConfig,
};
