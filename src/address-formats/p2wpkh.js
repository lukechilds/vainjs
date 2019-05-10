const bitcoin = require('bitcoinjs-lib');
const {bech32} = require('./charsets');

const p2wpkh = {
	prefix: 'bc1q',
	charset: bech32
};

p2wpkh.derive = pubkey => {
	const {address} = bitcoin.payments.p2wpkh({pubkey});

	return address;
};

module.exports = p2wpkh;
