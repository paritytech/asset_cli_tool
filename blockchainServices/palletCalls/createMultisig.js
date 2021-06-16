const {
  createKeyMulti,
  encodeAddress,
  sortAddresses,
} = require("@polkadot/util-crypto");
const inquirer = require("inquirer");

const question = [
  {
    type: "input",
    name: "promptAddresses",
    message: "input an array of addresses, first address will submit the tx",
    default:
      '["5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY","5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty", "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y"]',
  },
  {
    type: "input",
    name: "threshold",
    message: "m of n",
    default: "2",
  },
  {
    type: "input",
    name: "SS58Prefix",
    message: "42 for substrate, 0 for polkadot/statemint, 2 for kusama/statemine",
    default: "42",
  },
];

const createMultisig = async () => {
  const { promptAddresses, threshold, SS58Prefix } = await inquirer.prompt(question);
  const addresses = JSON.parse(promptAddresses)
  console.log({addresses, threshold, SS58Prefix})
  const index = 0

  // Address as a byte array.
  const multiAddress = createKeyMulti(addresses, threshold);

  // Convert byte array to SS58 encoding.
  const Ss58Address = encodeAddress(multiAddress, SS58Prefix);

  console.log(`\nMultisig Address: ${Ss58Address}`);

  // Take addresses and remove the sender.
  const otherSignatories = addresses.filter((who) => who !== addresses[index]);

  // Sort them by public key.
  const otherSignatoriesSorted = sortAddresses(otherSignatories, SS58Prefix);

  console.log(`\nOther Signatories: ${otherSignatoriesSorted}\n`);

  process.exit();
};

module.exports = {
  createMultisig,
};
