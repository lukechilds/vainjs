const bitcoin = require('bitcoinjs-lib');

const generateWif = () => {
	const keyPair = bitcoin.ECPair.makeRandom();
	const {publicKey} = keyPair;

	const format = () => ({
		wif: keyPair.toWIF()
	});

	return {publicKey, format};
};

module.exports = generateWif;
