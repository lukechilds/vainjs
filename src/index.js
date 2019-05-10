const Emitter = require('tiny-emitter');

const ONE_SECOND = 1000;

const addressFormats = new Map(Object.entries({
	p2pkh: require('./p2pkh'),
	'p2wpkh-p2sh': require('./p2wpkh-p2sh'),
	p2wpkh: require('./p2wpkh')
}));

class Vain extends Emitter {
	constructor({addressFormat = 'p2pkh', prefix}) {
		super();
		this.addressFormat = addressFormats.get(addressFormat);

		prefix.split('').forEach(char => {
			if (!this.addressFormat.charset.includes(char)) {
				throw new Error(`Invalid characters for address format "${addressFormat}"`);
			}
		});

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
