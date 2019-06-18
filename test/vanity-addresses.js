import test from 'ava';
import * as bitcoin from 'bitcoinjs-lib';
import * as bip39 from 'bip39';
import Vain from '..';

const deriveAddress = {
	p2pkh: pubkey => {
		return bitcoin.payments.p2pkh({pubkey}).address;
	},
	'p2wpkh-p2sh': pubkey => {
		return bitcoin.payments.p2sh({
			redeem: bitcoin.payments.p2wpkh({pubkey})
		}).address;
	},
	p2wpkh: pubkey => {
		return bitcoin.payments.p2wpkh({pubkey}).address;
	}
};

const testCases = [
	{
		options: {
			addressFormat: 'p2pkh',
			prefix: 'A'
		},
		expectedPrefix: '1A'
	},
	{
		options: {
			addressFormat: 'p2wpkh-p2sh',
			prefix: 'A'
		},
		expectedPrefix: '3A'
	},
	{
		options: {
			addressFormat: 'p2wpkh',
			prefix: 'a'
		},
		expectedPrefix: 'bc1qa'
	}
];

const additionalOptionCombos = [
	{
		keyFormat: 'wif'
	},
	{
		keyFormat: 'bip39'
	},
	{
		keyFormat: 'xpub',
		xpub: 'xpub6EDZZg3os4RaLxfPpnGBb7ajm6ccyjRs3PGZ5jNK31rPnbpyKb7dc87cEPaLEjFYDBGCQT8VMm8q8MVj2tj7HPBu8syxu82cdHLCNaQmT42'
	}
];

additionalOptionCombos.forEach(additionalOptions => {
	testCases.forEach(({options, expectedPrefix}) => {
		options = {...options, ...additionalOptions};

		test(`Vain generates a valid ${options.keyFormat} ${options.addressFormat} vanity address`, async t => {
			const vain = new Vain(options);
			const {address, ...keyData} = vain.generate();

			let publicKey;

			switch (options.keyFormat) {
				case 'wif': {
					({publicKey} = bitcoin.ECPair.fromWIF(keyData.wif));
					break;
				}

				case 'bip39': {
					const seed = await bip39.mnemonicToSeed(keyData.mnemonic);
					const node = bitcoin.bip32.fromSeed(seed);
					({publicKey} = node.derivePath(keyData.derivationPath));
					break;
				}

				case 'xpub': {
					const node = bitcoin.bip32.fromBase58(keyData.xpub);
					({publicKey} = node.derivePath(keyData.derivationPath));
					break;
				}

				default:
			}

			const keyAddress = deriveAddress[options.addressFormat](publicKey);

			t.true(address.startsWith(expectedPrefix));
			t.is(address, keyAddress);
		});
	});
});
