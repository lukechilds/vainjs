import test from 'ava';
import * as bitcoin from 'bitcoinjs-lib';
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
