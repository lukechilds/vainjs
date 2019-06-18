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

const multisigOptions = {
	keyFormat: 'multisig',
	addressFormat: 'p2sh',
	prefix: 'A',
	pubkeys: [
		Buffer.from('030000000000000000000000000000000000000000000000000000000000000001', 'hex'),
		Buffer.from('030000000000000000000000000000000000000000000000000000000000000002', 'hex'),
		Buffer.from('030000000000000000000000000000000000000000000000000000000000000003', 'hex')
	],
	m: 2
};

invalidCharsets.forEach(options => {
	test(`Vain throws when \`options.prefix\` doesn't match the charset for ${options.addressFormat} addresses`, t => {
		const error = t.throws(() => new Vain(options));
		t.is(error.message, `Invalid characters for address format "${options.addressFormat}"`);
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

test('Vain throws when `options.keyFormat` is `multisig` when `options.addressFormat` is not `p2sh`', t => {
	const options = {...multisigOptions};
	delete options.addressFormat;
	const error = t.throws(() => new Vain(options));
	t.is(error.message, 'When using key format "multisig" address format must be "p2sh"');

	options.addressFormat = multisigOptions.addressFormat;
	t.notThrows(() => new Vain(options));
});

test('Vain throws when `options.keyFormat` is `multisig` when `options.pubkeys` is undefined', t => {
	const options = {...multisigOptions};
	delete options.pubkeys;
	const error = t.throws(() => new Vain(options));
	t.is(error.message, 'When using key format "multisig" a "pubkeys" array must be passed in');

	options.pubkeys = multisigOptions.pubkeys;
	t.notThrows(() => new Vain(options));
});

test('Vain throws when `options.keyFormat` is `multisig` when `options.m` is not a number', t => {
	const options = {...multisigOptions};
	delete options.m;
	const error = t.throws(() => new Vain(options));
	t.is(error.message, 'When using key format "multisig" an "m" value must be passed in');

	options.m = multisigOptions.m;
	t.notThrows(() => new Vain(options));
});
