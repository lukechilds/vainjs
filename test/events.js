import test from 'ava';
import * as bitcoin from 'bitcoinjs-lib';
import Vain from '..';

test('Vain instance emits `found` event when vanity address is found', t => {
	t.plan(2);

	const options = {
		prefix: 'A'
	};
	const vain = new Vain(options);

	vain.on('found', ({address, wif}) => {
		const keyPair = bitcoin.ECPair.fromWIF(wif);
		const {address: wifAddress} = bitcoin.payments.p2pkh({pubkey: keyPair.publicKey});

		t.true(address.startsWith(`1${options.prefix}`));
		t.is(address, wifAddress);
	});

	vain.generate();
});

test('Vain instance emits `update` event during address generation', t => {
	t.plan(1);

	const options = {
		prefix: '1BitcoinEaterAddressDontSend'
	};
	const vain = new Vain(options);

	vain.on('update', () => {
		vain.generating = false;
		t.pass();
	});

	vain.generate();
});
