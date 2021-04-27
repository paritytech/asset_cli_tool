const { ApiPromise, WsProvider } = require("@polkadot/api");
const { Keyring } = require("@polkadot/keyring");
const { cryptoWaitReady } = require('@polkadot/util-crypto');

const getApi = async () => {
  try {
    const wsProvider = new WsProvider("ws://127.0.0.1:9944");
    const api = new ApiPromise({
      provider: wsProvider,
    });
    await api.isReady;
    await cryptoWaitReady();
    return api;
  } catch (e) {
    console.log("error setting up api");
    throw new Error(e.message);
  }
};

const getKeypair = (mneumonic) => {
  try {
    const keyring = new Keyring({ type: "sr25519" });
    return keyring.addFromUri(mneumonic);
  } catch (e) {
    console.log("error setting up keypair");
    throw new Error(e.message);
  }
};





const signAndSend = (call, api, sender) => {
  console.log("sending transaction")
  call.signAndSend(sender, ({ status, events, dispatchError }) => {
      // status would still be set, but in the case of error we can shortcut
      // to just check it (so an error would indicate InBlock or Finalized)
      if (dispatchError) {
        if (dispatchError.isModule) {
          // for module errors, we have the section indexed, lookup
          const decoded = api.registry.findMetaError(dispatchError.asModule);
          const { documentation, method, section } = decoded;
  
          console.log(`${section}.${method}: ${documentation.join(" ")}`);
          process.exit();
        } else {
          // Other, CannotLookup, BadOrigin, no extra info
          console.log(dispatchError.toString());
          process.exit();
        }
      } else {
        if (status.isFinalized) {
          console.log("transaction successful");
          process.exit();
        }
      }
    });
  }
  


module.exports = {
  getApi,
  getKeypair,
  signAndSend
};
