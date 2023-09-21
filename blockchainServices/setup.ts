const { ApiPromise, WsProvider } = require('@polkadot/api');
const { Keyring } = require('@polkadot/keyring');
const { cryptoWaitReady } = require('@polkadot/util-crypto');
const { Ledger } = require('@polkadot/hw-ledger');
import type { Signer, SignerResult } from '@polkadot/api/types';
import type { Ledger as LedgerType } from '@polkadot/hw-ledger';
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

const getLedgerAddress = async () => {
	const network = await getNetwork();
	const ledger = new Ledger('hid', network);
	return await ledger.getAddress();
};

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
		const raw = this.#registry.createType('ExtrinsicPayload', payload, {
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
	console.log('\nsending ledger transaction');
	
	const network = await getNetwork();
	
	const ledger = new Ledger('hid', network);
	const sender = await ledger.getAddress();
	console.log({ sender });
	const ledgerSigner = new LedgerSigner(api.registry, ledger, 0, 0);
	const signAsync = await call.signAsync(sender.address, {
		signer: ledgerSigner,
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

const ledgerSignAndSendWithNonce = async (call: any, api: any) => {
	console.log('\nsending ledger transaction');

	const network = await getNetwork();
	
	const ledger = new Ledger('hid', network);
	const sender = await ledger.getAddress();
	console.log({ sender });
	const ledgerSigner = new LedgerSigner(api.registry, ledger, 0, 0);
	const signAsync = await call.signAsync(sender.address, {
		nonce: -1,
		signer: ledgerSigner,
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

const ledgerSignAndSendWithNonceAndExit = async (call: any, api: any) => {
	console.log('\nsending ledger transaction');

	const network = await getNetwork();
	
	const ledger = new Ledger('hid', network);
	const sender = await ledger.getAddress();
	console.log({ sender });
	const ledgerSigner = new LedgerSigner(api.registry, ledger, 0, 0);
	const signAsync = await call.signAsync(sender.address, {
		nonce: -1,
		signer: ledgerSigner,
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
	console.log('sending transaction');
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
