const Emitter = require('tiny-emitter');

const ONE_SECOND = 1000;

const keyFormats = new Map(Object.entries({
	wif: require('./key-formats/wif'),
	bip39: require('./key-formats/bip39')
}));

const addressFormats = new Map(Object.entries({
	p2pkh: require('./address-formats/p2pkh'),
	'p2wpkh-p2sh': require('./address-formats/p2wpkh-p2sh'),
	p2wpkh: require('./address-formats/p2wpkh')
}));

class Vain extends Emitter {
	constructor({keyFormat = 'wif', addressFormat = 'p2pkh', prefix}) {
		super();
		this.generateKey = keyFormats.get(keyFormat);
		this.addressFormat = addressFormats.get(addressFormat);

		if (typeof prefix !== 'string' || prefix.length === 0) {
			throw new Error('Prefix must be set');
		}

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

			const {generateKey, addressFormat} = this;

			let found;
			let attempts = 0;
			let keyData;
			let address;
			let lastUpdate = Date.now();

			while (!found) {
				attempts++;

				keyData = generateKey({addressFormat});
				address = addressFormat.derive(keyData.publicKey);

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

			const result = {
				duration,
				attempts,
				addressesPerSecond,
				address,
				...keyData.format()
			};
			this.emit('found', result);
			resolve(result);
		});
	}
}

module.exports = Vain;
