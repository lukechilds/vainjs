const Vain = require('..');
const prettyMs = require('pretty-ms');

const prefix = 'BTC';
console.log();
console.log(`Searching for the prefix "${prefix}"...`);

const vain = new Vain({prefix});

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
