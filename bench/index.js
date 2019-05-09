const Vain = require('..');
const prettyMs = require('pretty-ms');

['p2pkh', 'p2wpkh-p2sh'].forEach(addressFormat => {
	const prefix = 'BTC';
	console.log();
	console.log(`Searching for the prefix "${prefix}" for addres format "${addressFormat}"...`);

	const vain = new Vain({prefix, addressFormat});

	vain.on('update', data => {
		const duration = prettyMs(data.duration);
		const {attempts} = data;
		const speed = `${data.addressesPerSecond} addr/s`;
		console.log(`Duration: ${duration} | Attempts: ${attempts} | Speed: ${speed}`);
	});

	vain.on('found', data => {
		console.log();
		console.log(`Address: ${data.address}`);
		console.log(`WIF: ${data.wif}`);
		console.log();
		console.log(`Found in ${prettyMs(data.duration)}`);
		console.log(`Speed: ${data.addressesPerSecond} addr/s`);
	});

	vain.start();
});
