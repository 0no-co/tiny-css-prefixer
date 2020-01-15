import /* codegen */ '../scripts/generate-prefix-map';

export const prefixProperty = prop => {
  const props = [prop];
  if (msPrefixRe.test(prop)) {
    props.push(`-ms-${prop}`);
  } else if (mozPrefixRe.test(prop)) {
    props.push(`-moz-${prop}`);
  } else if (webkitPrefixRe.test(prop)) {
    props.push(`-webkit-${prop}`);
  }

  return props;
};

export const prefixValue = (prop, value) => {
  if (
    (prop === 'position' && value === 'sticky') ||
    (prop === 'background-clip' && value === 'text')
  ) {
    return `-webkit-${value}, ${value}`;
  }

  return value;
};
