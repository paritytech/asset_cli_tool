const { ApiPromise, WsProvider } = require('@polkadot/api');
const { Keyring } = require('@polkadot/keyring');
const { cryptoWaitReady } = require('@polkadot/util-crypto');
const { LedgerGeneric } = require('@polkadot/hw-ledger');
const { knownLedger } = require('@polkadot/networks/defaults');
const { merkleizeMetadata } = require('@polkadot-api/merkleize-metadata');
const { objectSpread, u8aToHex } = require('@polkadot/util');
import type { ApiPromise as ApiPromiseType } from '@polkadot/api';
import type { Signer, SignerResult } from '@polkadot/api/types';
import type { LedgerGeneric as LedgerType } from '@polkadot/hw-ledger';
import type { Registry, SignerPayloadJSON } from '@polkadot/types/types';

const globalAny: any = global;

const getApi = async () => {
	try {
		const wsProvider = new WsProvider(globalAny.network.endpoint);
		const api = new ApiPromise({
			types: {
				MultiAssets: 'Vec<MultiAsset>',
			},
			provider: wsProvider,
		});
		await api.isReady;
		await cryptoWaitReady();
		return api;
	} catch (e: any) {
		console.log('\nerror setting up api');
		throw new Error(e.message);
	}
};

const getKeypair = async (mnemonic: string) => {
	await cryptoWaitReady();
	try {
		const keyring = new Keyring({ type: 'sr25519' });
		return keyring.addFromUri(mnemonic);
	} catch (e: any) {
		console.log('\nerror setting up keypair');
		throw new Error(e.message);
	}
};

const getNetwork = async () => {
	const networkName = globalAny.network.name;
	var network;
	switch (networkName) {
		case 'Kusama Asset Hub':
			network = 'statemine';
			break;
		case 'Polkadot Asset Hub':
			network = 'statemint';
			break;
		default:
			throw new Error('Unsupported chain');
	}
	return network;
}

const getLedgerAddress = async (migration = false) => {
	const api = await getApi();
	const network = await getNetwork();
	const ledger = migration ? new LedgerGeneric('hid', network, knownLedger[network]) : new LedgerGeneric('hid', network, knownLedger['polkadot']);
	const ss58 = api.consts.system.ss58Prefix.toNumber();
	
	return await ledger.getAddress(ss58, false, ledger.accountOffset, ledger.addressOffset);
};

let id = 0;

class LedgerSigner implements Signer {
	readonly #api: ApiPromiseType;
	readonly #accountOffset: number;
	readonly #addressOffset: number;
	readonly #getLedger: LedgerType;
	readonly #registry: Registry;

	constructor(
		api: ApiPromiseType,
		registry: Registry,
		getLedger: LedgerType,
		accountOffset: number,
		addressOffset: number,
	) {
		this.#api = api;
		this.#accountOffset = accountOffset;
		this.#addressOffset = addressOffset;
		this.#getLedger = getLedger;
		this.#registry = registry;
	}

	private async getMetadataProof (payload: SignerPayloadJSON) {
		const m = await this.#api.call.metadata.metadataAtVersion(15);
		const { specName, specVersion } = this.#api.runtimeVersion;
		const merkleizedMetadata = merkleizeMetadata(m.toHex(), {
		  base58Prefix: (this.#api as any).consts.system.ss58Prefix.toNumber(),
		  decimals: this.#api.registry.chainDecimals[0],
		  specName: specName.toString(),
		  specVersion: specVersion.toNumber(),
		  tokenSymbol: this.#api.registry.chainTokens[0]
		});
		const metadataHash = u8aToHex(merkleizedMetadata.digest());
		const newPayload = objectSpread({}, payload, { withSignedTransaction: true, metadataHash, mode: 1 });
		const raw = this.#registry.createType('ExtrinsicPayload', newPayload);
	
		return {
		  raw,
		  txMetadata: merkleizedMetadata.getProofForExtrinsicPayload(u8aToHex(raw.toU8a(true)))
		};
	  }

	public async signPayload(payload: SignerPayloadJSON): Promise<SignerResult> {

		const { address } = await this.#getLedger.getAddress(
			(this.#api as any).consts.system.ss58Prefix.toNumber(),
			false,
			this.#accountOffset,
			this.#addressOffset
		  );

		const { raw, txMetadata } = await this.getMetadataProof(payload);

		const buff = Buffer.from(txMetadata);

		const { signature } = await this.#getLedger.signWithMetadata(
			raw.toU8a(true),
			this.#accountOffset,
			this.#addressOffset,
			{ metadata: buff }
		);

		const extrinsic = this.#registry.createType(
			'Extrinsic',
			{ method: raw.method },
			{ version: 4 }
		  );
	  
		  extrinsic.addSignature(address, signature, raw.toHex());

		return { id: ++id, signature, signedTransaction: extrinsic.toHex() };
	}
}



const ledgerSignAndSend = async (call: any, api: any, migration = false) => {
	console.log('sending transaction to ledger\n');
	
	const network = await getNetwork();

	const ss58 = api.consts.system.ss58Prefix.toNumber();
	
	const ledger = migration ? new LedgerGeneric('hid', network, knownLedger[network]) : new LedgerGeneric('hid', network, knownLedger['polkadot']);
	const sender = await ledger.getAddress(ss58, false, ledger.accountOffset, ledger.addressOffset);
	const ledgerSigner = new LedgerSigner(api, api.registry, ledger, 0, 0);
	const signAsync = await call.signAsync(sender.address, {
		signer: ledgerSigner,
		withSignedTransaction: true,
	});
	signAsync.send(({ status, dispatchError }: any) => {
		// status would still be set, but in the case of error we can shortcut
		// to just check it (so an error would indicate InBlock or Finalized)
		if (dispatchError) {
			if (dispatchError.isModule) {
				// for module errors, we have the section indexed, lookup
				const decoded = api.registry.findMetaError(dispatchError.asModule);
				const { documentation, method, section } = decoded;

				console.log(`${section}.${method}: ${documentation.join(' ')}`);
				process.exit();
			} else {
				// Other, CannotLookup, BadOrigin, no extra info
				console.log(dispatchError.toString());
				process.exit();
			}
		} else {
			if (status.isFinalized) {
				console.log('\ntransaction successful');
				process.exit();
			}
		}
	});
};

const ledgerSignAndSendWithNonce = async (call: any, api: any, migration = false) => {
	console.log('sending transaction to ledger\n');

	const network = await getNetwork();

	const ss58 = api.consts.system.ss58Prefix.toNumber();
	
	const ledger = migration ? new LedgerGeneric('hid', network, knownLedger[network]) : new LedgerGeneric('hid', network, knownLedger['polkadot']);
	const sender = await ledger.getAddress(ss58, false, ledger.accountOffset, ledger.addressOffset);;
	const ledgerSigner = new LedgerSigner(api, api.registry, ledger, 0, 0);
	const signAsync = await call.signAsync(sender.address, {
		nonce: -1,
		signer: ledgerSigner,
		withSignedTransaction: true,
	});
	signAsync.send(({ status, dispatchError }: any) => {
		// status would still be set, but in the case of error we can shortcut
		// to just check it (so an error would indicate InBlock or Finalized)
		if (dispatchError) {
			if (dispatchError.isModule) {
				// for module errors, we have the section indexed, lookup
				const decoded = api.registry.findMetaError(dispatchError.asModule);
				const { documentation, method, section } = decoded;

				console.log(`${section}.${method}: ${documentation.join(' ')}`);
				process.exit();
			} else {
				// Other, CannotLookup, BadOrigin, no extra info
				console.log(dispatchError.toString());
				process.exit();
			}
		} else {
			if (status.isFinalized) {
				console.log('\ntransaction successful');
			}
		}
	});
};

const ledgerSignAndSendWithNonceAndExit = async (call: any, api: any, migration = false) => {
	console.log('\nsending transaction to ledger');

	const network = await getNetwork();
	
	const ss58 = api.consts.system.ss58Prefix.toNumber();

	const ledger = migration ? new LedgerGeneric('hid', network, knownLedger[network]) : new LedgerGeneric('hid', network, knownLedger['polkadot']);

	const sender = await ledger.getAddress(ss58, false, ledger.accountOffset, ledger.addressOffset);;
	const ledgerSigner = new LedgerSigner(api, api.registry, ledger, 0, 0);
	const signAsync = await call.signAsync(sender.address, {
		nonce: -1,
		signer: ledgerSigner,
		withSignedTransaction: true,
	});
	signAsync.send(({ status, dispatchError }: any) => {
		// status would still be set, but in the case of error we can shortcut
		// to just check it (so an error would indicate InBlock or Finalized)
		if (dispatchError) {
			if (dispatchError.isModule) {
				// for module errors, we have the section indexed, lookup
				const decoded = api.registry.findMetaError(dispatchError.asModule);
				const { documentation, method, section } = decoded;

				console.log(`${section}.${method}: ${documentation.join(' ')}`);
				process.exit();
			} else {
				// Other, CannotLookup, BadOrigin, no extra info
				console.log(dispatchError.toString());
				process.exit();
			}
		} else {
			if (status.isFinalized) {
				console.log('\ntransaction successful');
				process.exit();
			}
		}
	});
};

const signAndSend = (call: any, api: any, sender: any) => {
	console.log('\nsending transaction');
	call.signAndSend(sender, ({ status, dispatchError }: any) => {
		// status would still be set, but in the case of error we can shortcut
		// to just check it (so an error would indicate InBlock or Finalized)
		if (dispatchError) {
			if (dispatchError.isModule) {
				// for module errors, we have the section indexed, lookup
				const decoded = api.registry.findMetaError(dispatchError.asModule);
				const { documentation, method, section } = decoded;

				documentation ? console.log(`\n${section}.${method}`) : console.log(`\n${section}.${method}: ${documentation.join(' ')}`);;
				process.exit();
			} else {
				// Other, CannotLookup, BadOrigin, no extra info
				console.log(dispatchError.toString());
				process.exit();
			}
		} else {
			if (status.isFinalized) {
				console.log('\ntransaction successful');
				process.exit();
			}
		}
	});
};

const signAndSendWithNonce = async (call: any, api: any, sender: any) => {
	console.log('\nsending transaction with nonce');
	await call.signAndSend(
		sender,
		{ nonce: -1 },
		({ status, dispatchError }: any) => {
			// status would still be set, but in the case of error we can shortcut
			// to just check it (so an error would indicate InBlock or Finalized)
			if (dispatchError) {
				if (dispatchError.isModule) {
					// for module errors, we have the section indexed, lookup
					const decoded = api.registry.findMetaError(dispatchError.asModule);
					const { documentation, method, section } = decoded;

					console.log(`\n${section}.${method}: ${documentation.join(' ')}`);
					process.exit();
				} else {
					// Other, CannotLookup, BadOrigin, no extra info
					console.log(dispatchError.toString());
					process.exit();
				}
			} else {
				if (status.isFinalized) {
					console.log('\ntransaction successful');
				}
			}
		}
	);
};

const signAndSendWithNonceAndExit = async (
	call: any,
	api: any,
	sender: any
) => {
	console.log('\nsending transaction and exiting');
	await call.signAndSend(
		sender,
		{ nonce: -1 },
		({ status, dispatchError }: any) => {
			// status would still be set, but in the case of error we can shortcut
			// to just check it (so an error would indicate InBlock or Finalized)
			if (dispatchError) {
				if (dispatchError.isModule) {
					// for module errors, we have the section indexed, lookup
					const decoded = api.registry.findMetaError(dispatchError.asModule);
					const { documentation, method, section } = decoded;

					console.log(`${section}.${method}: ${documentation.join(' ')}`);
					process.exit();
				} else {
					// Other, CannotLookup, BadOrigin, no extra info
					console.log(dispatchError.toString());
					process.exit();
				}
			} else {
				if (status.isFinalized) {
					console.log('\ntransaction successful');
					process.exit();
				}
			}
		}
	);
};

module.exports = {
	getApi,
	getKeypair,
	signAndSend,
	ledgerSignAndSend,
	getLedgerAddress,
	ledgerSignAndSendWithNonce,
	ledgerSignAndSendWithNonceAndExit,
	signAndSendWithNonce,
	signAndSendWithNonceAndExit,
};
