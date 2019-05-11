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
