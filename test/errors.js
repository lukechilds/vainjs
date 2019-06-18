import test from 'ava';
import Vain from '..';

const invalidCharsets = [
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

invalidCharsets.forEach(options => {
	test(`Vain throws when \`options.prefix\` doesn't match the charset for ${options.addressFormat} addresses`, t => {
		const error = t.throws(() => new Vain(options));
		t.true(error.message.includes('Invalid characters for address format'));
	});
});

test('Vain throws when `options.prefix` is `undefined`', t => {
	const options = {};
	const error = t.throws(() => new Vain(options));
	t.is(error.message, 'Prefix must be set');

	options.prefix = 'BTC';
	t.notThrows(() => new Vain(options));
});

test('Vain throws when `options.xpub` is `undefined` when `options.keyFormat` is `xpub`', t => {
	const options = {keyFormat: 'xpub', prefix: 'BTC'};
	const error = t.throws(() => new Vain(options));
	t.is(error.message, 'An xpub string must be passed in');

	options.xpub = 'xpub6EDZZg3os4RaLxfPpnGBb7ajm6ccyjRs3PGZ5jNK31rPnbpyKb7dc87cEPaLEjFYDBGCQT8VMm8q8MVj2tj7HPBu8syxu82cdHLCNaQmT42';
	t.notThrows(() => new Vain(options));
});
