const bitcoin = require('bitcoinjs-lib');
const {base58} = require('./charsets');

const p2pkh = {
	prefix: '1',
	charset: base58
};

p2pkh.derive = () => {
	const keyPair = bitcoin.ECPair.makeRandom();
	const {address} = bitcoin.payments.p2pkh({pubkey: keyPair.publicKey});

	return {
		address,
		keyPair
	};
};

p2pkh.format = ({address, keyPair}) => ({
	address,
	wif: keyPair.toWIF()
});

module.exports = p2pkh;
