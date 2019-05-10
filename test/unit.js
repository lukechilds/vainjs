import test from 'ava';
import * as bitcoin from 'bitcoinjs-lib';
import * as bip39 from 'bip39';
import Vain from '..';

test('Vain is exported', t => {
	t.not(Vain, undefined);
});

test('Vain derives a p2pkh vanity address', async t => {
	const options = {
		addressFormat: 'p2pkh',
		prefix: 'A'
	};
	const vain = new Vain(options);
	const {address, wif} = await vain.start();

	const keyPair = bitcoin.ECPair.fromWIF(wif);
	const {address: wifAddress} = bitcoin.payments.p2pkh({pubkey: keyPair.publicKey});

	t.true(address.startsWith(`1${options.prefix}`));
	t.is(address, wifAddress);
});

test('Vain derives a p2wpkh-p2sh vanity address', async t => {
	const options = {
		addressFormat: 'p2wpkh-p2sh',
		prefix: 'A'
	};
	const vain = new Vain(options);
	const {address, wif} = await vain.start();

	const keyPair = bitcoin.ECPair.fromWIF(wif);
	const {address: wifAddress} = bitcoin.payments.p2sh({
		redeem: bitcoin.payments.p2wpkh({pubkey: keyPair.publicKey})
	});

	t.true(address.startsWith(`3${options.prefix}`));
	t.is(address, wifAddress);
});

test('Vain derives a p2wpkh vanity address', async t => {
	const options = {
		addressFormat: 'p2wpkh',
		prefix: 'a'
	};
	const vain = new Vain(options);
	const {address, wif} = await vain.start();

	const keyPair = bitcoin.ECPair.fromWIF(wif);
	const {address: wifAddress} = bitcoin.payments.p2wpkh({pubkey: keyPair.publicKey});

	t.true(address.startsWith(`bc1q${options.prefix}`));
	t.is(address, wifAddress);
});

test('Vain derives a p2pkh vanity seed', async t => {
	const options = {
		keyFormat: 'bip39',
		addressFormat: 'p2pkh',
		prefix: 'A'
	};
	const vain = new Vain(options);
	const {address, derivationPath, mnemonic} = await vain.start();

	const seed = await bip39.mnemonicToSeed(mnemonic);
	const node = bitcoin.bip32.fromSeed(seed);
	const {publicKey} = node.derivePath(derivationPath);
	const {address: seedAddress} = bitcoin.payments.p2pkh({pubkey: publicKey});

	t.true(address.startsWith(`1${options.prefix}`));
	t.is(address, seedAddress);
});

test('Vain derives a p2wpkh-p2sh vanity seed', async t => {
	const options = {
		keyFormat: 'bip39',
		addressFormat: 'p2wpkh-p2sh',
		prefix: 'A'
	};
	const vain = new Vain(options);
	const {address, derivationPath, mnemonic} = await vain.start();

	const seed = await bip39.mnemonicToSeed(mnemonic);
	const node = bitcoin.bip32.fromSeed(seed);
	const {publicKey} = node.derivePath(derivationPath);
	const {address: seedAddress} = bitcoin.payments.p2sh({
		redeem: bitcoin.payments.p2wpkh({pubkey: publicKey})
	});

	t.true(address.startsWith(`3${options.prefix}`));
	t.is(address, seedAddress);
});

test('Vain derives a p2wpkh vanity seed', async t => {
	const options = {
		keyFormat: 'bip39',
		addressFormat: 'p2wpkh',
		prefix: 'a'
	};
	const vain = new Vain(options);
	const {address, derivationPath, mnemonic} = await vain.start();

	const seed = await bip39.mnemonicToSeed(mnemonic);
	const node = bitcoin.bip32.fromSeed(seed);
	const {publicKey} = node.derivePath(derivationPath);
	const {address: seedAddress} = bitcoin.payments.p2wpkh({pubkey: publicKey});

	t.true(address.startsWith(`bc1q${options.prefix}`));
	t.is(address, seedAddress);
});

test('Vain defaults to p2pkh if no address format is set', async t => {
	const options = {
		prefix: 'A'
	};
	const vain = new Vain(options);
	const {address, wif} = await vain.start();

	const keyPair = bitcoin.ECPair.fromWIF(wif);
	const {address: wifAddress} = bitcoin.payments.p2pkh({pubkey: keyPair.publicKey});

	t.true(address.startsWith(`1${options.prefix}`));
	t.is(address, wifAddress);
});

test('Vain throws on invalid charset', t => {
	const optionsArray = [
		{
			addressFormat: 'p2pkh',
			prefix: '0'
		},
		{
			addressFormat: 'p2wpkh-p2sh',
			prefix: '0'
		},
		{
			addressFormat: 'p2wpkh',
			prefix: '1'
		}
	];

	optionsArray.forEach(options => {
		const error = t.throws(() => new Vain(options));
		t.true(error.message.includes('Invalid characters for address format'));
	});
});

test('Vain throws on undefined prefix', t => {
	const options = {};
	const error = t.throws(() => new Vain(options));
	t.is(error.message, 'Prefix must be set');
});
