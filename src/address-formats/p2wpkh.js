const bitcoin = require('bitcoinjs-lib');
const {bech32} = require('./charsets');

const p2wpkh = {
	prefix: 'bc1q',
	charset: bech32,
	bip39: '84'
};

p2wpkh.derive = ({publicKey}) => {
	const {address} = bitcoin.payments.p2wpkh({pubkey: publicKey});

	return address;
};

module.exports = p2wpkh;
