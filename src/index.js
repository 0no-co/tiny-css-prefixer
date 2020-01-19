import /* codegen */ '../scripts/generate-prefix-map';

const ms = 0b001;
const moz = 0b010;
const webkit = 0b100;
const cache = {};

export const prefixProperty = prop => {
  if (cache[prop]) return cache[prop];
  return (cache[prop] = (ms * msPrefixRe.test(prop))
    | (moz * mozPrefixRe.test(prop))
    | (webkit * webkitPrefixRe.test(prop)));
};

export const prefixValue = (prop, value) => {
  if (webkitValuePrefixRe.test(prop)) {
    return value.replace(/(sticky|text)/, '-webkit-$1, $1');
  }

  return value;
};
