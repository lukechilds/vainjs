const Vain = require('..');
const prettyMs = require('pretty-ms');

const isCI = process.env.CI;

const xpub = 'xpub6EDZZg3os4RaLxfPpnGBb7ajm6ccyjRs3PGZ5jNK31rPnbpyKb7dc87cEPaLEjFYDBGCQT8VMm8q8MVj2tj7HPBu8syxu82cdHLCNaQmT42';

const options = [
	{
		keyFormat: 'wif',
		addressFormat: 'p2pkh',
		prefix: 'BTC'
	},
	{
		keyFormat: 'wif',
		addressFormat: 'p2wpkh-p2sh',
		prefix: 'BTC'
	},
	{
		keyFormat: 'wif',
		addressFormat: 'p2wpkh',
		prefix: 'xyz'
	},
	{
		keyFormat: 'bip39',
		addressFormat: 'p2pkh',
		prefix: 'Hi'
	},
	{
		keyFormat: 'bip39',
		addressFormat: 'p2wpkh-p2sh',
		prefix: 'Hi'
	},
	{
		keyFormat: 'bip39',
		addressFormat: 'p2wpkh',
		prefix: 'yz'
	},
	{
		keyFormat: 'xpub',
		xpub,
		addressFormat: 'p2pkh',
		prefix: 'BTC'
	},
	{
		keyFormat: 'xpub',
		xpub,
		addressFormat: 'p2wpkh-p2sh',
		prefix: 'BTC'
	},
	{
		keyFormat: 'xpub',
		xpub,
		addressFormat: 'p2wpkh',
		prefix: 'xyz'
	}
];

options.forEach(options => {
	console.log();
	console.log('========================================================================================');
	console.log('Benchmarking options:', options);
	console.log('========================================================================================');

	const vain = new Vain(options);

	if (!isCI) {
		vain.on('update', data => {
			const duration = prettyMs(data.duration);
			const attempts = data.attempts.toLocaleString();
			const speed = `${data.addressesPerSecond.toLocaleString()} addr/s`;
			console.log(`Duration: ${duration} | Attempts: ${attempts} | Speed: ${speed}`);
		});
	}

	vain.on('found', data => {
		console.log();
		console.log(`Address: ${data.address}`);

		switch (options.keyFormat) {
			case 'wif':
				console.log(`WIF: ${data.wif}`);
				break;

			case 'bip39':
				console.log(`Derivation Path: ${data.derivationPath}`);
				console.log(`Mnemonic: ${data.mnemonic}`);
				break;

			case 'xpub':
				console.log(`Derivation Path: ${data.derivationPath}`);
				console.log(`xpub: ${data.xpub}`);
				break;

			default:
		}

		console.log();
		console.log(`Found in ${prettyMs(data.duration)} after ${data.attempts.toLocaleString()} attempts`);
		console.log(`Speed: ${data.addressesPerSecond.toLocaleString()} addr/s`);
	});

	vain.generate();
});
