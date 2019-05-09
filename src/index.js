const Emitter = require('tiny-emitter');

const p2pkh = require('./p2pkh');
const p2wpkhp2sh = require('./p2wpkh-p2sh');
const p2wpkh = require('./p2wpkh');

const addressFormats = new Map(Object.entries({
	p2pkh,
	'p2wpkh-p2sh': p2wpkhp2sh,
	p2wpkh
}));

const ONE_SECOND = 1000;

class Vain extends Emitter {
	constructor({prefix, addressFormat = 'p2pkh'}) {
		super();
		this.addressFormat = addressFormats.get(addressFormat);
		this.prefix = `${this.addressFormat.prefix}${prefix}`;
	}

	start() {
		return new Promise(resolve => {
			const startTime = Date.now();

			let found;
			let attempts = 0;
			let data;
			let lastUpdate = Date.now();

			while (!found) {
				attempts++;

				data = this.addressFormat.derive();

				if (data.address.startsWith(this.prefix)) {
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

			const result = {
				duration,
				addressesPerSecond,
				...this.addressFormat.format(data)
			};
			this.emit('found', result);
			resolve(result);
		});
	}
}

module.exports = Vain;
