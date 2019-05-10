const bitcoin = require('bitcoinjs-lib');
const {base58} = require('./charsets');

const p2pkh = {
	prefix: '1',
	charset: base58,
	bip39: '44'
};

p2pkh.derive = pubkey => {
	const {address} = bitcoin.payments.p2pkh({pubkey});

	return address;
};

module.exports = p2pkh;
