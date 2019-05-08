const Emitter = require('tiny-emitter');
const bitcoin = require('bitcoinjs-lib');

const ONE_SECOND = 1000;

const p2pkh = prefix => {
	const emitter = new Emitter();

	process.nextTick(() => {
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

			if (address.startsWith(prefix)) {
				found = true;
			}

			const now = Date.now();
			if ((now - lastUpdate) > ONE_SECOND) {
				const duration = now - startTime;
				const addressesPerSecond = Math.floor(attempts / (duration / ONE_SECOND));
				emitter.emit('update', {
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

		emitter.emit('found', {
			duration,
			addressesPerSecond,
			address,
			wif: keyPair.toWIF()
		});
	});

	return emitter;
};

module.exports = p2pkh;
