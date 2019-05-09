const bitcoin = require('bitcoinjs-lib');

const p2wpkh = {
	prefix: 'bc1q'
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
