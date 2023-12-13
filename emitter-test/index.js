const {chain}  = require('stream-chain');
const {parser} = require('stream-json/Parser');
//const {emitter} = require('stream-json/Emitter');

const Emitter = require('stream-json/Emitter');

const emitter = new Emitter();

const fs = require('fs');

const pipeline = chain([
  fs.createReadStream('sample.json'),
  parser(),
  emitter
]);

let objectCounter = 0;
pipeline.output.on('startObject', () => ++objectCounter);
pipeline.output.on('end', () => console.log(`Found ${objectCounter} objects.`));
