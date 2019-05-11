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
});
