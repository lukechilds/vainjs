const bitcoin = require('bitcoinjs-lib');

const generateXpubKey = ({options, attempts}) => {
	const change = 0;
	const index = attempts - 1;
	const derivationPath = `${change}/${index}`;

	const node = bitcoin.bip32.fromBase58(options.xpub);
	const {publicKey} = node.derivePath(derivationPath);

	const format = () => ({
		xpub: options.xpub,
		derivationPath
	});

	return {publicKey, format};
};

module.exports = generateXpubKey;
