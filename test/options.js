import test from 'ava';
import * as bitcoin from 'bitcoinjs-lib';
import Vain from '..';

test('Vain defaults to p2pkh if no address format is set', t => {
	const options = {
		prefix: 'A'
	};
	const vain = new Vain(options);
	const {address, wif} = vain.generate();

	const keyPair = bitcoin.ECPair.fromWIF(wif);
	const {address: wifAddress} = bitcoin.payments.p2pkh({pubkey: keyPair.publicKey});

	t.true(address.startsWith(`1${options.prefix}`));
	t.is(address, wifAddress);
});

test('Vain allows setting bip39 entropy via `options.entropy`', t => {
	const options = {
		prefix: 'A',
		keyFormat: 'bip39',
		entropy: 128
	};
	let vain = new Vain(options);
	let {mnemonic} = vain.generate();
	t.is(mnemonic.split(' ').length, 12);

	options.entropy = 256;
	vain = new Vain(options);
	({mnemonic} = vain.generate());
	t.is(mnemonic.split(' ').length, 24);
});
