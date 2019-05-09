const Vain = require('..');
const prettyMs = require('pretty-ms');

const isCI = process.env.CI;

const options = [
	{
		addressFormat: 'p2pkh',
		prefix: isCI ? 'Luke' : 'BTC'
	},
	{
		addressFormat: 'p2wpkh-p2sh',
		prefix: isCI ? 'Luke' : 'BTC'
	},
	{
		addressFormat: 'p2wpkh',
		prefix: isCI ? 'luke' : 'xyz'
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
      const {attempts} = data;
      const speed = `${data.addressesPerSecond} addr/s`;
      console.log(`Duration: ${duration} | Attempts: ${attempts} | Speed: ${speed}`);
    });
  }

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
