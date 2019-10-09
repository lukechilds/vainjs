const bitcoin = require('bitcoinjs-lib');

const generateRedeemScript = ({pubkeys, m}) => {
	const keyPair = bitcoin.ECPair.makeRandom();
	const {publicKey} = keyPair;

	// BIP 67 lexicographically ordered pubkeys
	pubkeys = [
		...pubkeys,
		publicKey
	].sort(Buffer.comapre);

	let redeemScript;
	let n;
	({output: redeemScript, m, n, pubkeys} = bitcoin.payments.p2ms({
		pubkeys,
		m
	}));

	const format = () => ({redeemScript, m, n, pubkeys});

	return {redeemScript, format};
};

module.exports = generateRedeemScript;
