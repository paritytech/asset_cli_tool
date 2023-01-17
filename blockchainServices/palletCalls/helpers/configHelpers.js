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

  let config

  try {
    config = require("../../../multisigConfig" + network.name + ".json");
  } catch (e) {
  }

  multisigAccount = config.multisigAccount
    ? config.multisigAccount
    : multisigAccount;
  call = config.call ? config.call : call;
  promptArguments = config.arguments ? config.arguments : JSON.parse(promptArguments);
  threshold = config.threshold ? config.threshold : threshold;
  otherSignatories = config.signatories
    ? config.signatories
    : JSON.parse(otherSignatories);
  admin = config.ledger ? "ledger" : admin
  const sender = config.ledger ? await getLedgerAddress() : getKeypair(admin);
  console.log({sender})
  otherSignatories = otherSignatories.filter((who) => who !== sender.address);
  otherSignatories.sort();

  return {
    multisigAccount,
    call,
    promptArguments,
    threshold,
    otherSignatories,
	  sender,
    admin
  };
};

module.exports = {
  multisigConfig,
};
