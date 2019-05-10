const bitcoin = require('bitcoinjs-lib');
const {bech32} = require('./charsets');

const p2wpkh = {
	prefix: 'bc1q',
	charset: bech32
};

p2wpkh.derive = () => {
	const keyPair = bitcoin.ECPair.makeRandom();
	const {address} = bitcoin.payments.p2wpkh({pubkey: keyPair.publicKey});

	return {
		address,
		keyPair
	};
};

p2wpkh.format = ({address, keyPair}) => ({
	address,
	wif: keyPair.toWIF()
});

module.exports = p2wpkh;
