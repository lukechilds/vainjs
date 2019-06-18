const Emitter = require('tiny-emitter');

const ONE_SECOND = 1000;

const keyFormats = {
	wif: require('./key-formats/wif'),
	bip39: require('./key-formats/bip39'),
	xpub: require('./key-formats/xpub'),
	multisig: require('./key-formats/multisig')
};

const addressFormats = {
	p2pkh: require('./address-formats/p2pkh'),
	'p2wpkh-p2sh': require('./address-formats/p2wpkh-p2sh'),
	p2wpkh: require('./address-formats/p2wpkh'),
	p2sh: require('./address-formats/p2sh')
};

class Vain extends Emitter {
	constructor(options = {}) {
		super();

		this.options = {
			keyFormat: 'wif',
			addressFormat: 'p2pkh',
			...options
		};

		this.generating = false;
		this.generateKey = keyFormats[this.options.keyFormat];
		this.addressFormat = addressFormats[this.options.addressFormat];

		if (typeof this.options.prefix !== 'string' || this.options.prefix.length === 0) {
			throw new Error('Prefix must be set');
		}

		this.options.prefix.split('').forEach(char => {
			if (!this.addressFormat.charset.includes(char)) {
				throw new Error(`Invalid characters for address format "${this.options.prefix.addressFormat}"`);
			}
		});

		this.prefix = `${this.addressFormat.prefix}${this.options.prefix}`;

		if (this.options.keyFormat === 'xpub' && typeof this.options.xpub !== 'string') {
			throw new Error('An xpub string must be passed in');
		}
	}

	generate() {
		this.generating = true;
		const startTime = Date.now();

		const {generateKey, addressFormat, options} = this;

		let found;
		let attempts = 0;
		let keyData;
		let address;
		let lastUpdate = Date.now();

		while (!found) {
			if (!this.generating) {
				return {stopped: true};
			}

			attempts++;

			keyData = generateKey({...options, addressFormat, attempts});
			address = addressFormat.derive(keyData);

			if (address.startsWith(this.prefix)) {
				found = true;
				this.generating = false;
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
		return result;
	}
}

module.exports = Vain;
