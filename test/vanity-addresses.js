import test from 'ava';
import * as bitcoin from 'bitcoinjs-lib';
import * as bip39 from 'bip39';
import Vain from '..';

const addressFormats = {
	p2pkh: require('../src/address-formats/p2pkh'),
	'p2wpkh-p2sh': require('../src/address-formats/p2wpkh-p2sh'),
	p2wpkh: require('../src/address-formats/p2wpkh'),
	p2sh: require('../src/address-formats/p2sh')
};

const xpub = 'xpub6EDZZg3os4RaLxfPpnGBb7ajm6ccyjRs3PGZ5jNK31rPnbpyKb7dc87cEPaLEjFYDBGCQT8VMm8q8MVj2tj7HPBu8syxu82cdHLCNaQmT42';

const testCases = [
	{
		keyFormat: 'wif',
		addressFormat: 'p2pkh',
		prefix: 'A'
	},
	{
		keyFormat: 'wif',
		addressFormat: 'p2wpkh-p2sh',
		prefix: 'A'
	},
	{
		keyFormat: 'wif',
		addressFormat: 'p2wpkh',
		prefix: 'a'
	},
	{
		keyFormat: 'bip39',
		addressFormat: 'p2pkh',
		prefix: 'A'
	},
	{
		keyFormat: 'bip39',
		addressFormat: 'p2wpkh-p2sh',
		prefix: 'A'
	},
	{
		keyFormat: 'bip39',
		addressFormat: 'p2wpkh',
		prefix: 'a'
	},
	{
		keyFormat: 'xpub',
		xpub,
		addressFormat: 'p2pkh',
		prefix: 'A'
	},
	{
		keyFormat: 'xpub',
		xpub,
		addressFormat: 'p2wpkh-p2sh',
		prefix: 'A'
	},
	{
		keyFormat: 'xpub',
		xpub,
		addressFormat: 'p2wpkh',
		prefix: 'a'
	},
	{
		keyFormat: 'multisig',
		addressFormat: 'p2sh',
		prefix: 'A',
		pubkeys: [
			Buffer.from('030000000000000000000000000000000000000000000000000000000000000001', 'hex'),
			Buffer.from('030000000000000000000000000000000000000000000000000000000000000002', 'hex'),
			Buffer.from('030000000000000000000000000000000000000000000000000000000000000003', 'hex')
		],
		m: 2
	}
];

testCases.forEach(options => {
	test(`Vain generates a valid ${options.keyFormat} ${options.addressFormat} vanity address`, async t => {
		const addressFormat = addressFormats[options.addressFormat];
		const vain = new Vain(options);
		const {address, ...keyData} = vain.generate();

		let key;

		switch (options.keyFormat) {
			case 'wif': {
				key = bitcoin.ECPair.fromWIF(keyData.wif);
				break;
			}

			case 'bip39': {
				const seed = await bip39.mnemonicToSeed(keyData.mnemonic);
				const node = bitcoin.bip32.fromSeed(seed);
				key = node.derivePath(keyData.derivationPath);
				break;
			}

			case 'xpub': {
				const node = bitcoin.bip32.fromBase58(keyData.xpub);
				key = node.derivePath(keyData.derivationPath);
				break;
			}

			case 'multisig': {
				key = keyData;
				break;
			}

			default:
		}

		const keyAddress = addressFormat.derive(key);

		t.true(address.startsWith(addressFormat.prefix + options.prefix));
		t.is(address, keyAddress);
	});
});
