const bitcoin = require('bitcoinjs-lib');

const generateRedeemScript = ({pubkeys, m}) => {
	const keyPair = bitcoin.ECPair.makeRandom();
	const {publicKey} = keyPair;
	let redeemScript;
	let n;
	({output: redeemScript, m, n, pubkeys} = bitcoin.payments.p2ms({
		pubkeys: [
			...pubkeys,
			publicKey
		],
		m
	}));

	const format = () => ({redeemScript, m, n, pubkeys});

	return {redeemScript, format};
};

module.exports = generateRedeemScript;
