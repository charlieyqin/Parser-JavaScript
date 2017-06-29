/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const Applications = require('../src/data/Applications');
const types = ['BOTS', 'BROWSERS', 'OTHERS'];

/**
 * Write to file the regex for the specified type
 * @param {string} type
 */
function updateRegexes(type) {
  console.log(`Updating ${type} regexs`);
  let ids = [];
  if (type === 'BOTS') {
    ids = getSet(Applications[type]);
  } else {
    Object.keys(Applications[type]).forEach((subtype) => {
      ids = new Set([...ids, ...getSet(Applications[type][subtype])]);
    });
  }
  const regex = new RegExp(`(${[...ids].join('|')})`, 'i').toString();

  fs.writeFileSync(
    path.join(__dirname, `../data/regexes/applications-${type.toLowerCase()}.js`),
    '/* This file is automatically generated, do not edit manually! */\n\n' +
      '/* eslint-disable */\n\n' +
      `exports.${type}_REGEX = ${regex};`
  );
  console.log(`${type} regexes contains ${regex.split('|').length + 1} entries\n`);
}

/**
 * @param {array} list
 * @return {Set}
 */
function getSet(list) {
  const set = new Set();
  list.forEach(({id}) => set.add(id));
  return set;
}

types.forEach(updateRegexes);
