const Vain = require('..');
const prettyMs = require('pretty-ms');

[
  {
    addressFormat: 'p2pkh',
    prefix: 'BTC'
  },
  {
    addressFormat: 'p2wpkh-p2sh',
    prefix: 'BTC'
  },
  {
    addressFormat: 'p2wpkh',
    prefix: 'xyz'
  },
].forEach(({addressFormat, prefix}) => {
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
