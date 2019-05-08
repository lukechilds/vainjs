const Emitter = require('tiny-emitter');
const bitcoin = require('bitcoinjs-lib');

const p2pkh = require('./p2pkh');

const ONE_SECOND = 1000;

class Vain extends Emitter {
	constructor({prefix}) {
		super();
		this.prefix = `1${prefix}`;
	}

	start() {
		return new Promise(resolve => {
			const miner = p2pkh(this.prefix);
			miner.on('update', data => this.emit('update', data));
			miner.on('found', data => {
				this.emit('found', data);
				resolve(data);
			});
		});
	}
}

module.exports = Vain;
