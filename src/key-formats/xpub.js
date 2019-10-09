const bitcoin = require('bitcoinjs-lib');

const generateXpubKey = ({attempts, xpub}) => {
	const index = attempts - 1;

	const node = bitcoin.bip32.fromBase58(xpub);
	const {publicKey} = node.derive(index);

	const format = () => ({
		xpub,
		index
	});

	return {publicKey, format};
};

module.exports = generateXpubKey;
