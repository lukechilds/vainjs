const Emitter = require('tiny-emitter');
const bitcoin = require('bitcoinjs-lib');

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
			if((now - lastUpdate) > 1000) {
				const duration = now - startTime;
				const trysPerSecond = Math.floor(attempts / (duration / 1000));
				this.emit('update', {
					duration,
					attempts,
					trysPerSecond,
				});
				lastUpdate = now;
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
