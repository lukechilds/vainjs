import test from 'ava';
import Vain from '..';

test('Vain lexicographically orders multisig pubkeys (BIP 67)', t => {
	const origPubkeys = [
		Buffer.from('030000000000000000000000000000000000000000000000000000000000000002', 'hex'),
		Buffer.from('030000000000000000000000000000000000000000000000000000000000000001', 'hex'),
		Buffer.from('030000000000000000000000000000000000000000000000000000000000000003', 'hex')
	];
	const options = {
		keyFormat: 'multisig',
		addressFormat: 'p2sh',
		prefix: 'A',
		pubkeys: origPubkeys,
		m: 2
	};
	const vain = new Vain(options);
	const {pubkeys} = vain.generate();

	const origPubkeysSorted = pubkeys.filter(pubkey => origPubkeys.includes(pubkey));

	t.deepEqual(origPubkeysSorted, [
		Buffer.from('030000000000000000000000000000000000000000000000000000000000000001', 'hex'),
		Buffer.from('030000000000000000000000000000000000000000000000000000000000000002', 'hex'),
		Buffer.from('030000000000000000000000000000000000000000000000000000000000000003', 'hex')
	]);
});
