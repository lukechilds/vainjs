const Vain = require('..');
const prettyMs = require('pretty-ms');

const prefix = 'Luke';
console.log();
console.log(`Searching for the prefix "${prefix}"...`);

const vain = new Vain({prefix});

vain.on('update', data => {
  const duration = prettyMs(data.duration);
  const {attempts} = data;
  const speed = `${data.addressesPerSecond} addr/s`;
  console.log(`Duration: ${duration} | Attempts: ${attempts} | Speed: ${speed}`);
});

const result = vain.start();
console.log();
console.log(`Address: ${result.address}`);
console.log(`WIF: ${result.wif}`);
console.log();
console.log(`Found in ${prettyMs(result.duration)}`);
console.log(`Addresses per second: ${result.addressesPerSecond}`);
