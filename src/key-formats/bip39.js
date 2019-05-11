const bip39 = require('bip39');
const bitcoin = require('bitcoinjs-lib');

const generatebip39Key = ({addressFormat, options}) => {
	const mnemonic = bip39.generateMnemonic(options.entropy);
	const seed = bip39.mnemonicToSeedSync(mnemonic);

	const node = bitcoin.bip32.fromSeed(seed);
	const derivationPath = `m/${addressFormat.bip39}'/0'/0'/0/0`;
	const {publicKey} = node.derivePath(derivationPath);

	const format = () => ({
		derivationPath,
		mnemonic
	});

	return {publicKey, format};
};

module.exports = generatebip39Key;
