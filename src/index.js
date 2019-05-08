const Emitter = require('tiny-emitter');
const bitcoin = require('bitcoinjs-lib');

const ONE_SECOND = 1000;

class Vain extends Emitter {
	constructor({prefix}) {
		super();
		this.prefix = `1${prefix}`;
	}

	start() {
		const startTime = Date.now();

		let found;
		let attempts = 0;
		let keyPair;
		let address;
		let lastUpdate = Date.now();

		while (!found) {
			attempts++;
			keyPair = bitcoin.ECPair.makeRandom();
			({address} = bitcoin.payments.p2pkh({pubkey: keyPair.publicKey}));

			if (address.startsWith(this.prefix)) {
				found = true;
			}

			const now = Date.now();
			if ((now - lastUpdate) > ONE_SECOND) {
				const duration = now - startTime;
				const addressesPerSecond = Math.floor(attempts / (duration / ONE_SECOND));
				this.emit('update', {
					duration,
					attempts,
					addressesPerSecond
				});
				lastUpdate = now;
			}
		}

		const endTime = Date.now();
		const duration = endTime - startTime;
		const addressesPerSecond = Math.floor(attempts / (duration / ONE_SECOND));

		return {
			duration,
			addressesPerSecond,
			address,
			wif: keyPair.toWIF()
		};
	}
}

module.exports = Vain;
