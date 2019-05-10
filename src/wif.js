const bitcoin = require('bitcoinjs-lib');

const wif = {};

wif.generate = bitcoin.ECPair.makeRandom;

wif.format = keyPair => ({wif: keyPair.toWIF()});

module.exports = wif;
