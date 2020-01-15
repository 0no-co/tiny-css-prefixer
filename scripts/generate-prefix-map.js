#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const prefixMap = require('inline-style-prefixer/lib/data').default.prefixMap;
const mdnProperties = require('mdn-data/css/properties.json');

const PREFIX_MS = 'ms';
const PREFIX_MOZ = 'Moz';
const PREFIX_WEBKIT = 'Webkit';
const prefixPropRe = /^-(ms|moz|webkit)-/;

/** A list of all properties that have to be prefixed */
const properties = Object.keys(prefixMap)
  .map(prop => ({
    // Convert inline-style-based name to CSS property name
    name: prop.replace(/[A-Z]/g, '-$&').toLowerCase(),
    // This describes what kind of prefixes are necessary:
    ms: !!prefixMap[prop].includes(PREFIX_MS),
    moz: !!prefixMap[prop].includes(PREFIX_MOZ),
    webkit: !!prefixMap[prop].includes(PREFIX_WEBKIT),
  }))
  // Omit CSS properties that are not listed by MDN or are obsolete
  .filter(({ name }) => (
    mdnProperties[name] &&
    mdnProperties[name].status !== 'obsolete' &&
    // Skip some properties that aren't widely supported or don't need prefixing:
    name !== 'backdrop-filter' &&
    name !== 'filter' &&
    // Skip some properties that are obsolete:
    name !== 'scroll-snap-points-x' &&
    name !== 'scroll-snap-points-y' &&
    name !== 'scroll-snap-points-destination' &&
    name !== 'scroll-snap-points-coordinate' &&
    name !== 'flow-into' &&
    name !== 'flow-from' &&
    name !== 'wrap-flow' &&
    name !== 'wrap-through' &&
    name !== 'wrap-margin'
  ));

// See SUPPORT.md on background-clip
properties.push({
  name: 'background-clip',
  ms: false,
  moz: false,
  webkit: true
});

// These are supported in Firefox, Chrome, and Safari
// NOTE: Their variants with before/after are not supported
// by Firefox and should be avoided
properties.push(...[
  'margin-start',
  'margin-end',
  'padding-start',
  'padding-end',
  'border-start',
  'border-start-color',
  'border-start-style',
  'border-start-width',
  'border-end',
  'border-end-color',
  'border-end-style',
  'border-end-width',
  'border-start-start-radius',
  'border-start-end-radius',
  'border-end-start-radius',
  'border-end-end-radius',
].map(name => ({ name, ms: false, moz: true, webkit: true })));

/** A list of stable, non-prefixable property names */
const stablePropertyNames = Object.keys(mdnProperties)
  .filter(x => (
    // Only include non-obsolete CSS properties
    mdnProperties[x].status !== 'obsolete' &&
    x !== 'all' &&
    x !== '--*' &&
    // Skip some properties that aren't widely supported:
    x !== 'text-decoration-skip-ink' &&
    x !== 'text-decoration-thickness' &&
    // Exclude prefixed properties
    !prefixPropRe.test(x) &&
    // Exclude properties that are to be prefixed (i.e. non-standard)
    !properties.some(({ name }) => name === x)
  ));

/** Lists each prefixed property with the minimum substring that is needed to uniquely identity it */
const prefixPatterns = properties
  .map(prop => {
    let name = prop.name;
    for (let i = 2, l = name.length; i < l; i++) {
      const substr = name.slice(0, i);
      // Check for any name that conflicts with the substring in all known CSS properties
      if (stablePropertyNames.every(x => x === name || !x.startsWith(substr))) {
        name = substr;
        break;
      }
    }

    return { ...prop, name };
  });

/** Accepts a filter and builds a list of names in `prefixPatterns` */
const reducePrefixes = (filter = x => !!x) => {
  const set = prefixPatterns.reduce((acc, prop) => {
    if (filter(prop)) acc.add(prop.name);
    return acc;
  }, new Set());

  return [...set].sort();
};

const buildRegex = groups =>  `^(${groups.join('|')})`;

// Create all prefix sets for each prefix
const msPrefixes = buildRegex(reducePrefixes(x => x.ms));
const mozPrefixes = buildRegex(reducePrefixes(x => x.moz));
const webkitPrefixes = buildRegex(reducePrefixes(x => x.webkit));

module.exports = `
var msPrefixRe = /${msPrefixes}/;
var mozPrefixRe = /${mozPrefixes}/;
var webkitPrefixRe = /${webkitPrefixes}/;
`.trim();
