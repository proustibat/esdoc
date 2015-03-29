import fs from 'fs';
import {taffy} from 'taffydb';
import esdoc from './../../src/esdoc.js';
import defaultPublisher from '../../src/Publisher/publish.js';

let configFilePath = './test/fixture/esdoc.json';
let configJSON = fs.readFileSync(configFilePath, {encode: 'utf8'});
let config = JSON.parse(configJSON);

esdoc(config, (data, config)=>{
  let db = taffy(data);
  db.find = function(...cond) {
    return db(...cond).map((v)=>{
      let copy = JSON.parse(JSON.stringify(v));
      delete copy.___id;
      delete copy.___s;
      return copy;
    });
  };
  global.db = db;

  console.log(db.find({kind: 'class'}));
  console.log(db.find({name: '_p1'}));

  defaultPublisher(data, config);
});