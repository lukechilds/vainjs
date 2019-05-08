const bitcoin = require('bitcoinjs-lib');

class Vain {
	constructor({prefix}) {
		this.prefix = `1${prefix}`;
	}

	start() {
		const startTime = Date.now();

		let found;
		let attempts = 0;
		let keyPair;
		let address;

		while (!found) {
			attempts++;
			keyPair = bitcoin.ECPair.makeRandom();
			({address} = bitcoin.payments.p2pkh({pubkey: keyPair.publicKey}));

			if (address.startsWith(this.prefix)) {
				found = true;
			}
		}

		const endTime = Date.now();
		const duration = endTime - startTime;
		const trysPerSecond = Math.floor(attempts / (duration / 1000));

		return {
			duration,
			trysPerSecond,
			address,
			wif: keyPair.toWIF()
		};
	}
}

module.exports = Vain;
