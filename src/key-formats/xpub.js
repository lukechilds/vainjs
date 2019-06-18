const bitcoin = require('bitcoinjs-lib');

const generateXpubKey = ({attempts, xpub}) => {
	const change = 0;
	const index = attempts - 1;
	const derivationPath = `${change}/${index}`;

	const node = bitcoin.bip32.fromBase58(xpub);
	const {publicKey} = node.derivePath(derivationPath);

	const format = () => ({
		xpub,
		derivationPath
	});

	return {publicKey, format};
};

module.exports = generateXpubKey;
