const bitcoin = require('bitcoinjs-lib');

const p2wpkhp2sh = {
	prefix: '3'
};

p2wpkhp2sh.derive = () => {
	const keyPair = bitcoin.ECPair.makeRandom();
	const {address} = bitcoin.payments.p2sh({
		redeem: bitcoin.payments.p2wpkh({pubkey: keyPair.publicKey})
	});

	return {
		address,
		keyPair
	};
};

p2wpkhp2sh.format = ({address, keyPair}) => ({
	address,
	wif: keyPair.toWIF()
});

module.exports = p2wpkhp2sh;
