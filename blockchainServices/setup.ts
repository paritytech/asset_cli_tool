const { ApiPromise, WsProvider } = require("@polkadot/api");
const { Keyring } = require("@polkadot/keyring");
const { cryptoWaitReady } = require("@polkadot/util-crypto");
const { Ledger } = require("@polkadot/hw-ledger");
import type { Signer, SignerResult } from "@polkadot/api/types";
import type { Ledger as LedgerType } from "@polkadot/hw-ledger";
import type { Registry, SignerPayloadJSON } from "@polkadot/types/types";

const globalAny: any = global;

const getApi = async () => {
  try {
    const wsProvider = new WsProvider(globalAny.network.endpoint);
    const api = new ApiPromise({
      types: {
        MultiAssets: "Vec<MultiAsset>",
      },
      provider: wsProvider,
    });
    await api.isReady;
    await cryptoWaitReady();
    return api;
  } catch (e: any) {
    console.log("error setting up api");
    throw new Error(e.message);
  }
};

const getKeypair = (mneumonic: string) => {
  try {
    const keyring = new Keyring({ type: "sr25519" });
    return keyring.addFromUri(mneumonic);
  } catch (e: any) {
    console.log("error setting up keypair");
    throw new Error(e.message);
  }
};

const getLedgerAddress = async () => {
  const ledger = new Ledger("hid", globalAny.network.name);
  return await ledger.getAddress();
};

function isRawPayload(payload: any) {
  return !!payload.data;
}

let id = 0;

class LedgerSigner implements Signer {
  readonly #accountOffset: number;
  readonly #addressOffset: number;
  readonly #getLedger: LedgerType;
  readonly #registry: Registry;

  constructor(
    registry: Registry,
    getLedger: LedgerType,
    accountOffset: number,
    addressOffset: number
  ) {
    this.#accountOffset = accountOffset;
    this.#addressOffset = addressOffset;
    this.#getLedger = getLedger;
    this.#registry = registry;
  }

  public async signPayload(payload: SignerPayloadJSON): Promise<SignerResult> {
    const raw = this.#registry.createType("ExtrinsicPayload", payload, {
      version: payload.version,
    });
    console.log({ payload });
    const { signature } = await this.#getLedger.sign(
      raw.toU8a(true),
      this.#accountOffset,
      this.#addressOffset
    );

    return { id: ++id, signature };
  }
}

const ledgerSignAndSend = async (call: any, api: any) => {
  console.log("sending ledger transaction");

  const ledger = new Ledger("hid", globalAny.network.name);
  const sender = await ledger.getAddress();
  console.log({ sender });
  const ledgerSigner = new LedgerSigner(api.registry, ledger, 0, 0);
  const signAsync = await call.signAsync(sender.address, {
    signer: ledgerSigner,
  });
  signAsync.send(({ status, events, dispatchError }: any) => {
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
};

const signAndSend = (call: any, api: any, sender: any) => {
  console.log("sending transaction");
  call.signAndSend(sender, ({ status, events, dispatchError }: any) => {
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
};

module.exports = {
  getApi,
  getKeypair,
  signAndSend,
  ledgerSignAndSend,
  getLedgerAddress,
};
