const bitcoin = require('bitcoinjs-lib');
const {base58} = require('./charsets');

const p2wpkhp2sh = {
	prefix: '3',
	charset: base58,
	bip39: '49'
};

p2wpkhp2sh.derive = ({publicKey}) => {
	const {address} = bitcoin.payments.p2sh({
		redeem: bitcoin.payments.p2wpkh({pubkey: publicKey})
	});

	return address;
};

module.exports = p2wpkhp2sh;
