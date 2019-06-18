const bitcoin = require('bitcoinjs-lib');
const {base58} = require('./charsets');

const p2sh = {
	prefix: '3',
	charset: base58
};

p2sh.derive = ({redeemScript}) => {
	const {address} = bitcoin.payments.p2sh({
		redeem: {output: redeemScript}
	});

	return address;
};

module.exports = p2sh;
